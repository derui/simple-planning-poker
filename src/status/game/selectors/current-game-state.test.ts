import { Dependencies } from "@/dependencies";
import { create, createId } from "@/domains/game";
import { create, createId } from "@/domains/game-player";
import { create } from "@/domains/selectable-cards";
import { create } from "@/domains/story-point";
import { createUser, createId } from "@/domains/user";
import { flushPromisesAndTimers } from "@/test-lib";
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
  const cards = create([create(1)]);
  const registrar = createDependencyRegistrar<Dependencies>();
  registrar.register("gameRepository", {
    findBy: jest.fn().mockImplementation(() => {
      return create({
        id: createId("id"),
        name: "name",
        players: [createId("player")],
        cards,
      });
    }),
  } as any);
  registrar.register("gamePlayerRepository", {
    findBy: jest.fn().mockImplementation(() => {
      return create({
        id: createId("player"),
        gameId: createId("id"),
        userId: createId("user"),
        cards,
      });
    }),
  } as any);
  registrar.register("userRepository", {
    findBy: jest.fn().mockImplementation(() => {
      return createUser({
        id: createId("user"),
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
    set(currentGameIdState, createId("id"));
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
      gamePlayerId: createId("player"),
      mode: "normal",
      selected: false,
    });
    expect(value.viewModel.id).toBe(createId("id"));
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
