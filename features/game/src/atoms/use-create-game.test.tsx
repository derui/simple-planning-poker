import { ApplicablePoints, DomainEvent, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear, injectErrorOnSave } from "@spp/shared-domain/mock/game-repository";
import { clearSubsctiptions, subscribe } from "@spp/shared-use-case";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useCreateGame } from "./use-create-game.js";

vi.mock("@spp/feature-login", () => {
  return {
    useLoginUser: () => ({
      userId: "user",
      checkLoggedIn: () => {},
    }),
  };
});

beforeEach(() => {
  clear();
  clearSubsctiptions();
  injectErrorOnSave(undefined);
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status is creating", () => {
  // Arrange
  const store = createStore();

  // Act
  const { result } = renderHook(useCreateGame, {
    wrapper: createWrapper(store),
  });

  // Assert
  expect(result.current.loading).toBe(false);
  expect(result.current.errors).toEqual([]);
});

describe("validation", () => {
  test("get error if name is empty", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => result.current.create("", "1"));
    rerender();

    // Assert
    expect(result.current.errors).toContain("InvalidName");
  });

  test("get error if name is blank", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);

    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("   ", "1")));
    rerender();

    // Assert
    expect(result.current.errors).toContain("InvalidName");
  });

  test.each(["", "  "])(`get error if point is empty or blank`, async (v) => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
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
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "a,b")));
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors).toContain("InvalidPoints");
  });

  test("accept comma-separated list", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => {});
    result.current.create("foo", "1,3");
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(0);
  });

  test("accept large number in points", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result, rerender } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => {});
    result.current.create("foo", "1,30");
    rerender();

    // Assert
    expect(result.current.errors).toHaveLength(0);
  });
});

describe("Create", () => {
  test("change waiting status while creating game", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result, rerender } = renderHook(useCreateGame, { wrapper });
    await act(async () => {});

    // Act
    result.current.create("foo", "1");
    rerender();

    // Assert
    expect(result.current.loading).toEqual(true);
  });

  test("completed status after creating is finished", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    const dispatcher = sinon.fake<[DomainEvent.T]>();
    subscribe(dispatcher);
    const { result } = renderHook(useCreateGame, { wrapper });
    await act(async () => {});

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));

    // Assert
    expect(result.current.errors).toHaveLength(0);
    expect(result.current.loading).toEqual(false);
    expect(dispatcher.calledOnce).toBeTruthy();
    expect(Game.isGameCreated(dispatcher.lastCall.args[0])).toBeTruthy();
  });

  test("created game should have valid values", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result } = renderHook(useCreateGame, { wrapper });
    await act(async () => {});

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));

    const games = await GameRepository.listUserCreated({ user: User.createId("user") });

    // Assert
    expect(games[0].name).toEqual("foo");
    expect(ApplicablePoints.contains(games[0].points, StoryPoint.create(1))).toBeTruthy();
    expect(games[0].points).toHaveLength(1);
  });

  test("after completed, update owned game list", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result } = renderHook(useCreateGame, { wrapper });
    await act(async () => {});

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));

    const games = await GameRepository.listUserCreated({ user: User.createId("user") });

    // Assert
    expect(games).toHaveLength(1);
    expect(games[0].name).toEqual("foo");
    expect(games[0].points).toEqual(ApplicablePoints.parse("1"));
    expect(games[0].owner).toEqual(User.createId("user"));
  });

  test("set failed state if create is failed", async () => {
    // Arrange
    const store = createStore();
    const wrapper = createWrapper(store);
    injectErrorOnSave("failed");
    const { result } = renderHook(useCreateGame, { wrapper });
    await act(async () => {});

    // Act
    await act(async () => result.current.create("foo", "1"));

    // Assert
    expect(result.current.loading).toEqual(false);
  });

  test("get error if name is conflicted in owned games", async () => {
    // Arrange
    await GameRepository.save({
      game: Game.create({
        id: Game.createId(),
        name: GameName.create("bar"),
        owner: User.createId("user"),
        points: ApplicablePoints.create([StoryPoint.create(1)]),
      })[0],
    });
    const store = createStore();
    const wrapper = createWrapper(store);
    const { result } = renderHook(useCreateGame, { wrapper });

    // Act
    await act(async () => result.current.create("bar", "1"));

    // Assert
    expect(result.current.errors).toHaveLength(1);
    expect(result.current.errors).toContain("NameConflicted");
  });
});
