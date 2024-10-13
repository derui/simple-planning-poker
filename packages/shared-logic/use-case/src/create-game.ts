import { Prettify } from "@spp/shared-type-util";
import { EventDispatcher, UseCase } from "./base.js";
import { User, StoryPoint, ApplicablePoints, Game, GameRepository } from "@spp/shared-domain";

export interface CreateGameUseCaseInput {
  name: string;
  points: number[];
  createdBy: User.Id;
}

export type CreateGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "conflictName" }
  | { kind: "invalidStoryPoint" }
  | { kind: "invalidStoryPoints" }
  | { kind: "failed" };

export const newCreateGameUseCase = function newCreateGameUseCase(
  dispatcher: EventDispatcher,
  gameRepository: Prettify<GameRepository.T>
): UseCase<CreateGameUseCaseInput, CreateGameUseCaseOutput> {
  return async (input) => {
    if (!input.points.every(StoryPoint.isValid)) {
      return { kind: "invalidStoryPoint" };
    }

    const storyPoints = input.points.map(StoryPoint.create);

    if (!ApplicablePoints.isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoints" };
    }

    const ownedGames = (await gameRepository.listUserCreated(input.createdBy)).filter(
      (v) => v.owner == input.createdBy
    );
    if (ownedGames.some((v) => v.name == input.name)) {
      return { kind: "conflictName" };
    }

    const points = ApplicablePoints.create(storyPoints);

    const gameId = Game.createId();
    const [game, event] = Game.create({
      id: gameId,
      name: input.name,
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
