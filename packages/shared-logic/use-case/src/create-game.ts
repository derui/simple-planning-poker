import { ApplicablePoints, Game, GameName, StoryPoint, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace CreateGameUseCase {
  export interface Input {
    name: string;
    points: number[];
    createdBy: User.Id;
  }

  export type ErrorDetail = "conflictName" | "invalidName" | "invalidStoryPoints" | "failed";

  export type Output = { kind: "success"; game: Game.T } | { kind: "error"; detail: ErrorDetail };
}

export type CreateGameUseCase = UseCase<CreateGameUseCase.Input, CreateGameUseCase.Output>;

export const CreateGameUseCase: CreateGameUseCase = async (input) => {
  if (!input.points.every(StoryPoint.isValid)) {
    return { kind: "error", detail: "invalidStoryPoints" };
  }

  const storyPoints = input.points.map(StoryPoint.create);

  if (!ApplicablePoints.isValidStoryPoints(storyPoints)) {
    return { kind: "error", detail: "invalidStoryPoints" };
  }

  if (!GameName.isValid(input.name)) {
    return { kind: "error", detail: "invalidName" };
  }

  const ownedGames = await GameRepository.listUserCreated({ user: input.createdBy });

  if (ownedGames.some((v) => v.name == input.name)) {
    return { kind: "error", detail: "conflictName" };
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
    await GameRepository.save({ game });
  } catch (e) {
    console.warn(e);
    return { kind: "error", detail: "failed" };
  }

  dispatch(event);

  return { kind: "success", game };
};
