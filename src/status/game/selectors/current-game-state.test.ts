import { Dependencies } from "@/dependencies";
import { createGame, createGameId } from "@/domains/game";
import { createGamePlayer, createGamePlayerId } from "@/domains/game-player";
import { createSelectableCards } from "@/domains/selectable-cards";
import { createStoryPoint } from "@/domains/story-point";
import { createUser, createUserId } from "@/domains/user";
import { flushPromisesAndTimers } from "@/lib.test";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { snapshot_UNSTABLE } from "recoil";
import currentGameIdState from "../atoms/current-game-id-state";
import { initializeGameQuery } from "../atoms/game-query";
import currentGameState from "./current-game-state";

test("return default values if current game is not found", async () => {
  const snapshot = snapshot_UNSTABLE();
  const value = snapshot.getLoadable(currentGameState).valueOrThrow().valueMaybe();
  expect(value).toBeUndefined();
});

test("return view model if game id is presented", async () => {
  const cards = createSelectableCards([createStoryPoint(1)]);
  const registrar = createDependencyRegistrar<Dependencies>();
  registrar.register("gameRepository", {
    findBy: jest.fn().mockImplementation(() => {
      return createGame({
        id: createGameId("id"),
        name: "name",
        players: [createGamePlayerId("player")],
        cards,
      });
    }),
  } as any);
  registrar.register("gamePlayerRepository", {
    findBy: jest.fn().mockImplementation(() => {
      return createGamePlayer({
        id: createGamePlayerId("player"),
        gameId: createGameId("id"),
        userId: createUserId("user"),
        cards,
      });
    }),
  } as any);
  registrar.register("userRepository", {
    findBy: jest.fn().mockImplementation(() => {
      return createUser({
        id: createUserId("user"),
        name: "name",
        joinedGames: [],
      });
    }),
  } as any);
  registrar.register("gameObserver", {
    subscribe: jest.fn().mockImplementation(() => {
      return () => {};
    }),
  } as any);

  initializeGameQuery(registrar);

  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(currentGameIdState, createGameId("id"));
  });
  const release = snapshot.retain();

  try {
    await snapshot.getLoadable(currentGameState).toPromise();
    await flushPromisesAndTimers();
    const value = snapshot.getLoadable(currentGameState).valueOrThrow().valueMaybe()!;

    expect(value.viewModel.average).toBeUndefined();
    expect(value.viewModel.cards).toBe(cards.cards);
    expect(value.viewModel.hands).toContainEqual({
      card: undefined,
      name: "name",
      gamePlayerId: createGamePlayerId("player"),
      mode: "normal",
      selected: false,
    });
    expect(value.viewModel.id).toBe(createGameId("id"));
    expect(value.viewModel.name).toBe("name");
  } finally {
    release();
  }
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});
