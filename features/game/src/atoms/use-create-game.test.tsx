import { ApplicablePoints, DomainEvent, Game, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear as clearGame, injectErrorOnSave } from "@spp/shared-domain/mock/game-repository";
import { clearSubsctiptions, subscribe } from "@spp/shared-use-case";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import sinon from "sinon";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useCreateGame } from "./use-create-game.js";
import { loadUserAtom } from "./user-atom.js";
import { clear as clearUser } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";

beforeEach(async () => {
  clearSubsctiptions();
  injectErrorOnSave(undefined);

  clearGame();
  clearUser();

  await UserRepository.save({
    user: User.create({
      id: User.createId("id"),
      name: "name",
    }),
  });
});

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

test("initial status is creating", () => {
  // Arrange
  const store = createStore();
  store.set(loadUserAtom, User.createId("user"));

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
    store.set(loadUserAtom, User.createId("user"));

    const { result, rerender } = renderHook(useCreateGame, { wrapper: createWrapper(store) });

    // Act
    await act(async () => result.current.create("", "1"));
    rerender();

    // Assert
    expect(result.current.errors).toContain("InvalidName");
  });

  test("get error if name is blank", async () => {
    // Arrange
    const store = createStore();
    store.set(loadUserAtom, User.createId("user"));

    const { result, rerender } = renderHook(useCreateGame, { wrapper: createWrapper(store) });

    // Act
    await act(async () => Promise.resolve(result.current.create("   ", "1")));
    rerender();

    // Assert
    expect(result.current.errors).toContain("InvalidName");
  });

  test.each(["", "  "])(`get error if point is empty or blank`, async (v) => {
    // Arrange
    const store = createStore();
    store.set(loadUserAtom, User.createId("user"));

    const { result, rerender } = renderHook(useCreateGame, { wrapper: createWrapper(store) });

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
    store.set(loadUserAtom, User.createId("user"));
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
    store.set(loadUserAtom, User.createId("user"));
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
    store.set(loadUserAtom, User.createId("user"));
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
    store.set(loadUserAtom, User.createId("user"));
    const wrapper = createWrapper(store);
    const { result, rerender } = renderHook(useCreateGame, { wrapper });
    await act(async () => {});

    // Act
    result.current.create("foo", "1");
    await waitFor(() => expect(result.current.loading).toEqual(true));
    rerender();

    // Assert
    expect(result.current.loading).toEqual(true);
  });

  test("completed status after creating is finished", async () => {
    // Arrange
    const store = createStore();
    store.set(loadUserAtom, User.createId("user"));
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
    store.set(loadUserAtom, User.createId("user"));
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
    store.set(loadUserAtom, User.createId("user"));
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

  test("after completed, call the callback", async () => {
    // Arrange
    const store = createStore();
    store.set(loadUserAtom, User.createId("user"));
    const wrapper = createWrapper(store);
    const callback = vi.fn();

    const { result } = renderHook(() => useCreateGame(callback), { wrapper });

    // Act
    await act(async () => Promise.resolve(result.current.create("foo", "1")));
    await waitFor(() => !result.current.loading);

    // Assert
    expect(callback).toHaveBeenCalledOnce();
  });

  test("set failed state if create is failed", async () => {
    // Arrange
    const store = createStore();
    store.set(loadGamesAtom, User.createId("user"));
    const wrapper = createWrapper(store);
    injectErrorOnSave("failed");
    const callback = vi.fn();
    const { result } = renderHook(() => useCreateGame(callback), { wrapper });

    // Act
    await act(async () => result.current.create("foo", "1"));

    // Assert
    expect(result.current.loading).toEqual(false);
    expect(callback).not.toHaveBeenCalled();
  });
});
