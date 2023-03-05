import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { get, ref, update } from "firebase/database";
import { GameRepositoryImpl } from "./game-repository";
import { RoundRepositoryImpl } from "./round-repository";
import { joinedGames } from "./user-ref-resolver";
import * as Game from "@/domains/game";
import * as GamePlayer from "@/domains/game-player";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";

let database: any;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "demo-project-1234",
    database: {},
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
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: User.createId("id"),
    joinedPlayers: [GamePlayer.create({ userId: User.createId("id"), mode: GamePlayer.UserMode.normal })],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    finishedRounds: [],
  });

  const repository = new GameRepositoryImpl(database, new RoundRepositoryImpl(database));

  // Act
  await repository.save(game);
  const instance = await repository.findBy(game.id);

  // Assert
  expect(instance?.id).toEqual(game.id);
  expect(instance?.name).toEqual(game.name);
  expect(instance?.joinedPlayers).toEqual(game.joinedPlayers);
  expect(instance?.cards).toEqual(game.cards);
  expect(instance?.round).toEqual(game.round);
  expect(instance?.finishedRounds).toEqual(game.finishedRounds);
});

test("should not be able find a game if it did not save before", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database, new RoundRepositoryImpl(database));

  // Act
  const instance = await repository.findBy(Game.createId());

  // Assert
  expect(instance).toBeUndefined();
});

test("should save invitation in key", async () => {
  // Arrange
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: User.createId("id"),
    joinedPlayers: [GamePlayer.create({ userId: User.createId("id"), mode: GamePlayer.UserMode.normal })],
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    finishedRounds: [],
  });

  const repository = new GameRepositoryImpl(database, new RoundRepositoryImpl(database));

  // Act
  await repository.save(game);

  // Assert
  const snapshot = await get(ref(database, `/invitations/${Game.makeInvitation(game)}`));
  expect(snapshot.val()).toEqual(game.id);
});

test("should be able to list games an user joined", async () => {
  // Arrange
  const repository = new GameRepositoryImpl(database, new RoundRepositoryImpl(database));
  const gameId = Game.createId();
  const otherGameId = Game.createId();

  await update(ref(database), {
    [`${joinedGames(User.createId("1"))}/${gameId}`]: "name",
    [`${joinedGames(User.createId("1"))}/${otherGameId}`]: "name2",
    [`${joinedGames(User.createId("2"))}/${gameId}`]: "name",
    [`${joinedGames(User.createId("3"))}/${otherGameId}`]: "name2",
    [`${joinedGames(User.createId("4"))}/${gameId}`]: "name",
    [`${joinedGames(User.createId("5"))}/${otherGameId}`]: "name2",
  });

  // Act
  const ret = await repository.listUserJoined(User.createId("1"));

  // Assert
  expect(ret).toEqual(
    expect.arrayContaining([
      { id: gameId, name: "name" },
      { id: otherGameId, name: "name2" },
    ])
  );
});
