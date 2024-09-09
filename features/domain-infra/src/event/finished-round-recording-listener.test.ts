import { test, expect } from "vitest";
import sinon from "sinon";
import { FinishedRoundRecordingListener } from "./finished-round-recording-listener";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { createMockedRoundHistoryRepository, createMockedRoundRepository, randomFinishedRound } from "@/test-lib";

test("should create round history with finished round", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const round = randomFinishedRound();
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    round: round.id,
  });
  const repository = createMockedRoundRepository({
    findBy: sinon.fake.resolves(round),
  });
  const save = sinon.fake.resolves(undefined);
  const historyRepository = createMockedRoundHistoryRepository({
    save,
  });
  const listener = new FinishedRoundRecordingListener(repository, historyRepository);
  const [, event] = Game.newRound(game);

  // Act
  await listener.handle(event);

  // Assert
  expect(save.firstCall.args).toEqual([game.id, round]);
});

test("should not save if round is not found", async () => {
  // Arrange
  const owner = User.create({ id: User.createId(), name: "name" });
  const round = randomFinishedRound();
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner.id,
    cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
    round: round.id,
  });
  const repository = createMockedRoundRepository({
    findBy: sinon.fake.resolves(null),
  });
  const save = sinon.fake.resolves(undefined);
  const historyRepository = createMockedRoundHistoryRepository({
    save,
  });
  const listener = new FinishedRoundRecordingListener(repository, historyRepository);
  const [, event] = Game.newRound(game);

  // Act
  await listener.handle(event);

  // Assert
  expect(save.callCount).toBe(0);
});
