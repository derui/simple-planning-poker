import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { Prettify } from "@spp/shared-type-util";
import { UseCase } from "./base.js";

export namespace EditGameUseCase {
  export interface Input {
    gameId: Game.Id;
    name: string;
    points: number[];
    ownedBy: User.Id;
  }

  export type Output = { kind: "success"; game: Game.T } | { kind: "error"; detail: ErrorDetail } | { kind: "failed" };

  export type ErrorDetail =
    | {
        kind: "notFound";
      }
    | {
        kind: "conflictName";
      }
    | {
        kind: "invalidStoryPoint";
      }
    | {
        kind: "invalidName";
      };
}

export type EditGameUseCase = UseCase<Prettify<EditGameUseCase.Input>, EditGameUseCase.Output>;

/**
 * Edit game of user.
 */
export const EditGameUseCase: EditGameUseCase = async (input) => {
  if (!input.points.every(StoryPoint.isValid)) {
    return { kind: "error", detail: { kind: "invalidStoryPoint" } };
  }

  const storyPoints = input.points.map(StoryPoint.create);

  if (!ApplicablePoints.isValidStoryPoints(storyPoints)) {
    return { kind: "error", detail: { kind: "invalidStoryPoint" } };
  }

  if (!GameName.isValid(input.name)) {
    return { kind: "error", detail: { kind: "invalidName" } };
  }

  const game = await GameRepository.findBy({ id: input.gameId });
  if (!game) {
    return { kind: "error", detail: { kind: "notFound" } };
  }
  const games = await GameRepository.listUserCreated({ user: input.ownedBy });

  if (games.filter((v) => v.id != game.id).some((v) => v.name == input.name)) {
    return { kind: "error", detail: { kind: "conflictName" } };
  }

  const points = ApplicablePoints.create(storyPoints);

  const newGame = Game.changePoints(Game.changeName(game, input.name), points);

  try {
    await GameRepository.save({ game: newGame });
  } catch (e) {
    console.warn(e);
    return { kind: "failed" };
  }

  return { kind: "success", game: newGame };
};
