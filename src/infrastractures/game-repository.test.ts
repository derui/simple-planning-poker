import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { get, push, ref, set } from "firebase/database";
import { v4 } from "uuid";
import { GameRepositoryImpl } from "./game-repository";
import { joinedGames } from "./user-ref-resolver";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import { randomGame } from "@/test-lib";
import { JoinedGameState } from "@/domains/game-repository";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: v4(),
    database: {
      host: "127.0.0.1",
      port: 9000,
    },
  });
  database = testEnv.authenticatedContext("alice").database();
});

afterAll(async () => {
  testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearDatabase();
});

test("should be able to save and find a game", async () => {
  // Arrange
  let [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: User.createId("id"),
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    round: Round.createId(),
  });
  game = Game.joinUserAsPlayer(game, User.createId("other"), Game.makeInvitation(game))[0];

  const repository = new GameRepositoryImpl(database);

  // Act
  await repository.save(game);
  const instance = await repository.findBy(game.id);

  // Assert
  expect(instance?.id).toEqual(game.id);
  expect(instance?.name).toEqual(game.name);
  expect(instance?.cards).toEqual(game.cards);
  expect(instance?.round).toEqual(game.round);
  expect(instance?.joinedPlayers).toEqual(game.joinedPlayers);
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database);

  // Act
  const instance = await repository.findBy(Game.createId());

  // Assert
  expect(instance).toBeUndefined();
});

test("should save invitation in key", async () => {
  // Arrange
  let [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: User.createId("id"),
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    round: Round.createId(),
  });
  game = Game.joinUserAsPlayer(game, User.createId("id"), Game.makeInvitation(game))[0];

  const repository = new GameRepositoryImpl(database);

  // Act
  await repository.save(game);

  // Assert
  const snapshot = await get(ref(database, `/invitations/${Game.makeInvitation(game)}`));
  expect(snapshot.val()).toEqual(game.id);
});

test("should be able to list games an user joined", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database);

  let game = randomGame({ id: Game.createId("1"), name: "name" });
  let otherGame = randomGame({ id: Game.createId("2"), name: "name2" });

  await repository.save(game);
  await repository.save(otherGame);

  const data = [
    { id: User.createId("1"), relation: "player", gameId: game.id, state: JoinedGameState.joined },
    { id: User.createId("1"), relation: "player", gameId: otherGame.id, state: JoinedGameState.joined },
    { id: User.createId("2"), relation: "player", gameId: game.id },
    { id: User.createId("3"), relation: "player", gameId: otherGame.id },
    { id: User.createId("4"), relation: "player", gameId: otherGame.id },
    { id: User.createId("5"), relation: "player", gameId: game.id },
  ];

  for (let { id, ...rest } of data) {
    const newRef = push(ref(database, joinedGames(User.createId(id))));
    await set(newRef, rest);
  }

  // Act
  const ret = await repository.listUserJoined(User.createId("1"));

  // Assert
  expect(ret).toEqual(
    expect.arrayContaining([
      { id: game.id, name: "name", state: JoinedGameState.joined },
      { id: otherGame.id, name: "name2", state: JoinedGameState.joined },
    ])
  );
});
