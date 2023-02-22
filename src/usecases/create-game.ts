import { EventFactory } from "@/domains/event";
import { create, createId, GameId } from "@/domains/game";
import { createId, Id } from "@/domains/game-player";
import { GameRepository } from "@/domains/game-repository";
import { create, isValidStoryPoints } from "@/domains/selectable-cards";
import { create, isValid } from "@/domains/story-point";
import { Id } from "@/domains/user";
import { EventDispatcher, UseCase } from "./base";

export interface CreateGameUseCaseInput {
  name: string;
  points: number[];
  createdBy: Id;
}

export type CreateGameUseCaseOutput =
  | { kind: "success"; gameId: GameId; createdGamePlayerId: Id }
  | { kind: "invalidStoryPoint" }
  | { kind: "invalidStoryPoints" };

export class CreateGameUseCase implements UseCase<CreateGameUseCaseInput, CreateGameUseCaseOutput> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  execute(input: CreateGameUseCaseInput): CreateGameUseCaseOutput {
    if (!input.points.every(isValid)) {
      return { kind: "invalidStoryPoint" };
    }

    const storyPoints = input.points.map(create);

    if (!isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoints" };
    }

    const selectableCards = create(storyPoints);

    const gameId = createId();
    const playerId = createId();
    const game = create({
      id: gameId,
      name: input.name,
      players: [playerId],
      cards: selectableCards,
    });

    this.gameRepository.save(game);
    this.dispatcher.dispatch(EventFactory.gameCreated(gameId, input.name, input.createdBy, playerId, selectableCards));

    return { kind: "success", gameId, createdGamePlayerId: playerId };
  }
}
