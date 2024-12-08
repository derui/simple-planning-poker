import { ApplicablePoints, Game, GameName, GameRepository, StoryPoint, User } from "@spp/shared-domain";
import { Prettify } from "@spp/shared-type-util";
import { EventDispatcher, UseCase } from "./base.js";

export interface CreateGameUseCaseInput {
  name: string;
  points: number[];
  createdBy: User.Id;
}

export type CreateGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "conflictName" }
  | { kind: "invalidName" }
  | { kind: "invalidStoryPoints" }
  | { kind: "failed" };

export type CreateGameUseCase = UseCase<CreateGameUseCaseInput, CreateGameUseCaseOutput>;

export const newCreateGameUseCase = function newCreateGameUseCase(
  dispatcher: EventDispatcher,
  gameRepository: Prettify<GameRepository.T>
): CreateGameUseCase {
  return async (input) => {
    if (!input.points.every(StoryPoint.isValid)) {
      return { kind: "invalidStoryPoints" };
    }

    const storyPoints = input.points.map(StoryPoint.create);

    if (!ApplicablePoints.isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoints" };
    }

    if (!GameName.isValid(input.name)) {
      return { kind: "invalidName" };
    }

    const ownedGames = await gameRepository.listUserCreated(input.createdBy);

    if (ownedGames.some((v) => v.name == input.name)) {
      return { kind: "conflictName" };
    }

    const points = ApplicablePoints.create(storyPoints);

    const gameId = Game.createId();
    const [game, event] = Game.create({
      id: gameId,
      name: GameName.create(input.name),
      owner: input.createdBy,
      points: points,
    });

    try {
      await gameRepository.save(game);
    } catch (e) {
      console.warn(e);
      return { kind: "failed" };
    }

    dispatcher(event);

    return { kind: "success", game };
  };
};
