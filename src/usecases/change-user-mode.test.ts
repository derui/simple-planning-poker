import { test, expect } from "vitest";
import * as sinon from "sinon";
import { ChangeUserModeUseCase } from "./change-user-mode";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import * as GamePlayer from "@/domains/game-player";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import { createMockedGameRepository } from "@/test-lib";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    userId: User.createId(),
    gameId: Game.createId(),
    mode: GamePlayer.UserMode.inspector,
  };

  const repository = createMockedGameRepository();
  const useCase = new ChangeUserModeUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should save game", async () => {
  // Arrange
  const userId = User.createId();
  const input = {
    userId,
    gameId: Game.createId(),
    mode: GamePlayer.UserMode.inspector,
  };

  const save = sinon.fake();
  const game = Game.create({
    id: input.gameId,
    name: "name",
    cards: SelectableCards.create([StoryPoint.create(1)]),
    owner: userId,
    finishedRounds: [],
    round: Round.createId(),
  })[0];

  const repository = createMockedGameRepository({
    save,
    findBy: sinon.fake.resolves(game),
  });

  const useCase = new ChangeUserModeUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(save.callCount).toBe(1);
});
