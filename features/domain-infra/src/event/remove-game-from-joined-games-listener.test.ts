import { test, expect, beforeAll, afterAll, afterEach } from "vitest";
import { initializeTestEnvironment, RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { v4 } from "uuid";
import { Database, push, ref, set } from "firebase/database";
import { UserRepositoryImpl } from "../user-repository.js";
import { GameRepositoryImpl } from "../game-repository.js";
import { joinedGames } from "../user-ref-resolver.js";
import { RemoveGameFromJoinedGameListener } from "./remove-game-from-joined-games-listener.js";
import { Game, Voting, ApplicablePoints, StoryPoint, User } from "@spp/shared-domain";

let database: Database;
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: v4(),
    database: {
      host: "127.0.0.1",
      port: 9000,
    },
  });
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  database = testEnv.authenticatedContext(v4()).database() as unknown as Database;
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearDatabase();
});

test("should remove game from joined game of left user", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const player = User.create({ id: User.createId(), name: "player" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    points: ApplicablePoints.create([1, 2].map(StoryPoint.create)),
    voting: Voting.createId(),
  });
  const [_game] = Game.joinUserAsPlayer(game, player.id, Game.makeInvitation(game));
  const [, event] = Game.acceptLeaveFrom(_game, player.id);
  const userRepository = new UserRepositoryImpl(database);
  const gameRepository = new GameRepositoryImpl(database);
  const listener = new RemoveGameFromJoinedGameListener(database);
  await gameRepository.save(_game);
  await userRepository.save(owner);
  await userRepository.save(player);

  const data = [{ id: player.id, relation: "player", gameId: game.id }];

  for (const { id, ...rest } of data) {
    const newRef = push(ref(database, joinedGames(User.createId(id))));
    await set(newRef, rest);
  }

  // Act
  await listener.handle(event!);
  const repository = new GameRepositoryImpl(database);
  const ret = await repository.listUserJoined(player.id);

  // Assert
  expect(ret).toEqual([]);
});
