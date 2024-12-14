import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { clear } from "@spp/shared-domain/mock/game-repository";
import { beforeEach, expect, test } from "vitest";
import { DeleteGameUseCase } from "./delete-game.js";
import { clearSubsctiptions } from "./event-dispatcher.js";

beforeEach(() => {
  clear();
  clearSubsctiptions();
});

test("should delete the game if it exists", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    ownedBy: User.createId("user"),
  };
  await GameRepository.save({
    game: Game.create({
      id: Game.createId("game"),
      name: GameName.create("before"),
      points: ApplicablePoints.parse("1")!,
      owner: User.createId("user"),
    })[0],
  });

  // Act
  const ret = await DeleteGameUseCase(input);

  // Assert

  if (ret.kind == "success") {
    const saved = await GameRepository.findBy({ id: ret.game.id });
    expect(saved).toBeUndefined();
  } else {
    expect.fail("should be success");
  }
});

test("get error if the game do not owned", async () => {
  // Arrange
  const input = {
    gameId: Game.createId("game"),
    ownedBy: User.createId(),
  };

  await GameRepository.save({
    game: Game.create({
      id: Game.createId("game"),
      owner: User.createId("other"),
      name: GameName.create("foo"),
      points: ApplicablePoints.create([StoryPoint.create(1)]),
    })[0],
  });

  // Act
  const ret = await DeleteGameUseCase(input);

  // Assert
  expect(ret).toEqual({ kind: "error", detail: "doNotOwned" });
});
