import { EventDispatcher, UseCase } from "./base.js";
import { Voting, User, StoryPoint, ApplicablePoints, Game, GameRepository } from "@spp/shared-domain";

export interface CreateGameUseCaseInput {
  name: string;
  points: number[];
  createdBy: User.Id;
}

export type CreateGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "invalidStoryPoint" }
  | { kind: "invalidStoryPoints" };

export const newCreateGameUseCase = function newCreateGameUseCase(
  dispatcher: EventDispatcher,
  gameRepository: GameRepository.T
): UseCase<CreateGameUseCaseInput, CreateGameUseCaseOutput> {
  return async (input) => {
    if (!input.points.every(StoryPoint.isValid)) {
      return { kind: "invalidStoryPoint" };
    }

    const storyPoints = input.points.map(StoryPoint.create);

    if (!ApplicablePoints.isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoints" };
    }

    const points = ApplicablePoints.create(storyPoints);

    const gameId = Game.createId();
    const votingId = Voting.createId();
    const [game, event] = Game.create({
      id: gameId,
      name: input.name,
      owner: input.createdBy,
      points: points,
      voting: votingId,
    });

    await gameRepository.save(game);
    dispatcher(event);

    return { kind: "success", game };
  };
};
