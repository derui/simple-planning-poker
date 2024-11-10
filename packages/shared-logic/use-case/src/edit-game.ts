import { ApplicablePoints, Game, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { Prettify } from "@spp/shared-type-util";
import { UseCase } from "./base.js";

export interface EditGameUseCaseInput {
  gameId: Game.Id;
  name: string;
  points: number[];
  ownedBy: User.Id;
}

export type EditGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFound" }
  | { kind: "conflictName" }
  | { kind: "invalidStoryPoint" }
  | { kind: "failed" };

export type EditGameUseCase = UseCase<EditGameUseCaseInput, EditGameUseCaseOutput>;

export const newEditGameUseCase = function newEditGameUseCase(
  gameRepository: Prettify<GameRepository.T>
): EditGameUseCase {
  return async (input) => {
    if (!input.points.every(StoryPoint.isValid)) {
      return { kind: "invalidStoryPoint" };
    }

    const storyPoints = input.points.map(StoryPoint.create);

    if (!ApplicablePoints.isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoint" };
    }

    const game = await gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFound" };
    }
    const games = await gameRepository.listUserCreated(input.ownedBy);

    if (games.filter((v) => v.id != game.id).some((v) => v.name == input.name)) {
      return { kind: "conflictName" };
    }

    const points = ApplicablePoints.create(storyPoints);

    const newGame = Game.changePoints(Game.changeName(game, input.name), points);

    try {
      await gameRepository.save(newGame);
    } catch (e) {
      console.warn(e);
      return { kind: "failed" };
    }

    return { kind: "success", game: newGame };
  };
};
