import { ApplicablePoints, DomainEvent, Game, GameName, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { newCreateGameUseCase } from "@spp/shared-use-case";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { describe, expect, test } from "vitest";
import { injectUseCreataGame, useCreateGame } from "./create-game.js";
import { CreateGameStatus } from "./type.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status is creating", () => {
  // Arrange
  const repository = newMemoryGameRepository();
  const store = createStore();
  injectUseCreataGame({
    createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
    useLoginUser: sinon.fake.returns({ userId: undefined }),
  });

  // Act
  const { result } = renderHook(useCreateGame, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.status).toBeUndefined();
});

describe("validation", () => {
  test("get error if name is empty", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);

    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId() }),
    });

    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("", "1")));
    rerender();

    // Assert
    expect(result.current.errors).toContain("InvalidName");
  });

  test("get error if name is blank", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("   ", "1")));
    rerender();

    // Assert
    expect(result.current.errors).toContain("InvalidName");
  });

  test.each(["", "  "])(`get error if point is empty or blank`, async (v) => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", v)));
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors).toContain("InvalidPoints");
  });

  test("get error if points have non-numeric character", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "a,b")));
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors).toContain("InvalidPoints");
  });

  test("accept comma-separated list", () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    result.current.create("foo", "1,3");
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(0);
  });

  test("accept large number in points", () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    result.current.create("foo", "1,30");
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(0);
  });
});

describe("Create", () => {
  test("change waiting status while creating game", () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    result.current.create("foo", "1");
    rerender();

    // Assert
    expect(result.current.status).toEqual(CreateGameStatus.Waiting);
  });

  test("completed status after creating is finished", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    const dispatcher = sinon.fake<[DomainEvent.T]>();
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(dispatcher, repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });
    act(() => {
      rerender();
    });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));

    // Assert
    expect(result.current.status).toEqual(CreateGameStatus.Completed);
    expect(dispatcher.calledOnce).toBeTruthy();
    expect(Game.isGameCreated(dispatcher.lastCall.args[0])).toBeTruthy();
  });

  test("call callback after created", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    const dispatcher = sinon.fake<[DomainEvent.T]>();
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(dispatcher, repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });
    act(() => {
      rerender();
    });

    // Act
    const callback = sinon.fake();
    await act(async () => Promise.resolve(result.current.create("foo", "1", callback)));

    // Assert
    expect(callback.called).toBeTruthy();
  });

  test("created game should have valid values", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });
    act(() => {
      rerender();
    });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));

    const game = await repository.listUserCreated(User.createId("foo"));

    // Assert
    expect(game[0].name).toEqual("foo");
    expect(ApplicablePoints.contains(game[0].points, StoryPoint.create(1))).toBeTruthy();
    expect(game[0].points).toHaveLength(1);
  });

  test("after completed, update owned game list", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });
    act(() => {
      rerender();
    });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));

    const games = await repository.listUserCreated(User.createId("foo"));

    // Assert
    expect(games).toHaveLength(1);
    expect(games[0].name).toEqual("foo");
    expect(games[0].points).toEqual(ApplicablePoints.parse("1"));
    expect(games[0].owner).toEqual(User.createId("foo"));
  });

  test("set failed state if create is failed", async () => {
    // Arrange
    const repository: GameRepository.T = {
      ...newMemoryGameRepository(),
      save: sinon.fake.throws(new Error("failed")),
    };

    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    result.current.create("foo", "1");
    await act(async () => {});
    rerender();

    // Assert
    expect(result.current.status).toEqual(CreateGameStatus.Failed);
  });

  test("get error if name is conflicted in owned games", async () => {
    // Arrange
    const repository = newMemoryGameRepository([
      Game.create({
        id: Game.createId(),
        name: GameName.create("bar"),
        owner: User.createId("foo"),
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],
    ]);
    const store = createStore();
    const wrapper = createWrapper(store);
    injectUseCreataGame({
      createGameUseCase: newCreateGameUseCase(sinon.fake(), repository),
      useLoginUser: sinon.fake.returns({ userId: User.createId("foo") }),
    });
    const { result } = renderHook(useCreateGame, { wrapper });

    // Act
    result.current.create("bar", "1");
    await act(async () => {});

    // Assert
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors).toContain("NameConflicted");
  });
});
