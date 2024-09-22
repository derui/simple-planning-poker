import { describe, expect, test } from "vitest";
import { CreateGameStatus, createUseCreateGame } from "./game.js";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { ApplicablePoints, Game, GameRepository, StoryPoint, User, Voting } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import sinon from "sinon";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("UseCreateGame", () => {
  test("initial status is creating", () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();

    // Act
    const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), {
      wrapper: createWrapper(store),
    });

    // Assert
    expect(result.current.status).toEqual(CreateGameStatus.Preparing);
  });

  test("prepared status", async () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createWrapper(store);

    // Act
    const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

    await act(async () => result.current.prepare(User.createId("foo")));

    // Assert
    expect(result.current.status).toEqual(CreateGameStatus.Prepared);
  });

  describe("validation", () => {
    test("get error if name is empty", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("", "");

      // Assert
      expect(ret).toContain("InvalidName");
    });

    test("get error if name is blank", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("   ", "");

      // Assert
      expect(ret).toContain("InvalidName");
    });

    test.each(["", "  "])(`get error if point is empty or blank`, async (v) => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("foo", v);

      // Assert
      expect(ret).toHaveLength(1);
      expect(ret).toContain("InvalidPoints");
    });

    test("get error if points have non-numeric character", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("foo", "a,b");

      // Assert
      expect(ret).toHaveLength(1);
      expect(ret).toContain("InvalidPoints");
    });

    test("accept comma-separated list", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("foo", "1,2");

      // Assert
      expect(ret).toHaveLength(0);
    });

    test("accept large number in points", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("foo", "1,30");

      // Assert
      expect(ret).toHaveLength(0);
    });

    test("get error if name is conflicted in owned games", async () => {
      // Arrange
      const repository = newMemoryGameRepository([
        Game.create({
          id: Game.createId(),
          name: "foo",
          owner: User.createId("foo"),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
          voting: Voting.createId(),
        })[0],
      ]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      const ret = result.current.canCreate("foo", "1");

      // Assert
      expect(ret).toHaveLength(1);
      expect(ret).toContain("NameConflicted");
    });
  });

  describe("Create", () => {
    test("change waiting status while creating game", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
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
      const dispatcher = sinon.fake();
      const { result } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      await act(async () => result.current.create("foo", "1"));

      // Assert
      expect(result.current.status).toEqual(CreateGameStatus.Completed);
      expect(dispatcher.calledOnce).toBeTruthy();
      expect(Game.isGameCreated(dispatcher.lastCall.args[0])).toBeTruthy();
    });

    test("created game should have valid values", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const dispatcher = sinon.fake();
      const { result } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      await act(async () => result.current.create("foo", "1"));

      const game = await repository.listUserJoined(User.createId("foo"));

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
      const dispatcher = sinon.fake();
      const { result } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      await act(async () => result.current.create("foo", "1"));
      const ret = result.current.canCreate("foo", "1,3,5");

      // Assert
      expect(ret).toHaveLength(1);
      expect(ret).toContain("NameConflicted");
    });

    test("set failed state if create is failed", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const fakeRepository: GameRepository.T = {
        ...repository,
        save: sinon.fake.throws(new Error("failed")),
      };

      const store = createStore();
      const wrapper = createWrapper(store);
      const dispatcher = sinon.fake();
      const { result } = renderHook(() => createUseCreateGame(fakeRepository, dispatcher)(), { wrapper });

      // Act
      await act(async () => result.current.prepare(User.createId("foo")));
      await act(async () => result.current.create("foo", "1"));

      // Assert
      expect(result.current.status).toEqual(CreateGameStatus.Failed);
    });
  });
});
