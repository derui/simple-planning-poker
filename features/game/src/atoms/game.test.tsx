import { ApplicablePoints, DomainEvent, Game, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { newMemoryGameRepository } from "@spp/shared-domain/mock/game-repository";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { useEffect } from "react";
import sinon from "sinon";
import { describe, expect, test } from "vitest";
import { CreateGameStatus, createUseCreateGame, createUsePrepareGame } from "./game.js";

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

const createPreparationWrapper =
  (store: ReturnType<typeof createStore>, userId: User.Id, repository: GameRepository.T) =>
  ({ children }: { children: React.ReactNode }) => {
    const W = ({ children }: React.PropsWithChildren) => {
      const { prepare } = createUsePrepareGame(repository)();

      useEffect(() => {
        prepare(userId);
      }, []);

      return children;
    };

    return (
      <Provider store={store}>
        <W>{children}</W>
      </Provider>
    );
  };

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
    expect(result.current.status).toEqual(CreateGameStatus.Waiting);
  });

  test("prepared status", () => {
    // Arrange
    const repository = newMemoryGameRepository();
    const store = createStore();
    const wrapper = createPreparationWrapper(store, User.createId(), repository);

    // Act
    const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

    // Get affect prepared
    act(() => {
      rerender();
    });

    // Assert
    expect(result.current.status).toBeUndefined();
  });

  describe("validation", () => {
    test("get error if name is empty", () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      result.current.validate("", "");
      rerender();

      // Assert
      expect(result.current.errors).toContain("InvalidName");
    });

    test("get error if name is blank", () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      result.current.validate("   ", "");
      rerender();

      // Assert
      expect(result.current.errors).toContain("InvalidName");
    });

    test.each(["", "  "])(`get error if point is empty or blank`, (v) => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      result.current.validate("foo", v);
      rerender();

      // Assert
      expect(result.current.errors).toHaveLength(1);
      expect(result.current.errors).toContain("InvalidPoints");
    });

    test("get error if points have non-numeric character", () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      result.current.validate("foo", "a,b");
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
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      result.current.validate("foo", "1,2");

      // Assert
      expect(result.current.errors).toHaveLength(0);
    });

    test("accept large number in points", () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createWrapper(store);
      const { result } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });

      // Act
      result.current.validate("foo", "1,30");

      // Assert
      expect(result.current.errors).toHaveLength(0);
    });
  });

  describe("Create", () => {
    test("change waiting status while creating game", () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createPreparationWrapper(store, User.createId("foo"), repository);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });
      act(() => {
        rerender();
      });

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
      const wrapper = createPreparationWrapper(store, User.createId("foo"), repository);
      const dispatcher = sinon.fake<[DomainEvent.T]>();
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });
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

    test("created game should have valid values", async () => {
      // Arrange
      const repository = newMemoryGameRepository();
      const store = createStore();
      const wrapper = createPreparationWrapper(store, User.createId("foo"), repository);
      const dispatcher = sinon.fake();
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });
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
      const wrapper = createPreparationWrapper(store, User.createId("foo"), repository);
      const dispatcher = sinon.fake();
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });
      act(() => {
        rerender();
      });

      // Act
      await act(async () => Promise.resolve(result.current.create("foo", "1")));
      await act(async () => Promise.resolve(result.current.create("foo", "1,3,5")));

      // Assert
      expect(result.current.errors).toHaveLength(1);
      expect(result.current.errors).toContain("NameConflicted");
    });

    test("set failed state if create is failed", async () => {
      // Arrange
      const repository: GameRepository.T = {
        ...newMemoryGameRepository(),
        save: sinon.fake.throws(new Error("failed")),
      };

      const store = createStore();
      const wrapper = createPreparationWrapper(store, User.createId("foo"), repository);
      const dispatcher = sinon.fake();
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, dispatcher)(), { wrapper });
      act(() => {
        rerender();
      });

      // Act
      await act(async () => Promise.resolve(result.current.create("foo", "1")));

      // Assert
      expect(result.current.status).toEqual(CreateGameStatus.Failed);
    });

    test("get error if name is conflicted in owned games", async () => {
      // Arrange
      const repository = newMemoryGameRepository([
        Game.create({
          id: Game.createId(),
          name: "foo",
          owner: User.createId("foo"),
          points: ApplicablePoints.create([StoryPoint.create(1)]),
        })[0],
      ]);
      const store = createStore();
      const wrapper = createPreparationWrapper(store, User.createId("foo"), repository);
      const { result, rerender } = renderHook(() => createUseCreateGame(repository, sinon.fake())(), { wrapper });
      act(() => {
        rerender();
      });

      // Act
      await act(async () => Promise.resolve(result.current.create("foo", "1")));

      // Assert
      expect(result.current.errors).toHaveLength(1);
      expect(result.current.errors).toContain("NameConflicted");
    });
  });
});
