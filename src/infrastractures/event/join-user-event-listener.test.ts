import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { UserRepositoryImpl } from "../user-repository";
import { GameRepositoryImpl } from "../game-repository";
import { JoinUserEventListener } from "./join-user-event-listener";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";

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

test("should add joined user as owner", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const player = User.create({ id: User.createId(), name: "player" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    finishedRounds: [],
    round: Round.createId(),
  });
  const [, event] = Game.joinUserAsPlayer(game, player.id, Game.makeInvitation(game));
  const userRepository = new UserRepositoryImpl(database);
  const listener = new JoinUserEventListener(database);
  const repository = new GameRepositoryImpl(database);
  await userRepository.save(owner);
  await userRepository.save(player);

  // Act
  await listener.handle(event);
  const joinedGames = await repository.listUserJoined(player.id);

  // Assert
  expect(joinedGames).toEqual([{ id: game.id }]);
});
