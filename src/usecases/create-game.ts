import { EventFactory } from "@/domains/event";
import { createGame, createGameId, GameId } from "@/domains/game";
import { createGamePlayerId, GamePlayerId } from "@/domains/game-player";
import { GameRepository } from "@/domains/game-repository";
import { createSelectableCards, isValidStoryPoints } from "@/domains/selectable-cards";
import { createStoryPoint, isValidStoryPoint } from "@/domains/story-point";
import { UserId } from "@/domains/user";
import { EventDispatcher, UseCase } from "./base";

export interface CreateGameUseCaseInput {
  name: string;
  points: number[];
  createdBy: UserId;
}

export type CreateGameUseCaseOutput =
  | { kind: "success"; gameId: GameId; createdGamePlayerId: GamePlayerId }
  | { kind: "invalidStoryPoint" }
  | { kind: "invalidStoryPoints" };

export class CreateGameUseCase implements UseCase<CreateGameUseCaseInput, CreateGameUseCaseOutput> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  execute(input: CreateGameUseCaseInput): CreateGameUseCaseOutput {
    if (!input.points.every(isValidStoryPoint)) {
      return { kind: "invalidStoryPoint" };
    }

    const storyPoints = input.points.map(createStoryPoint);

    if (!isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoints" };
    }

    const selectableCards = createSelectableCards(storyPoints);

    const gameId = createGameId();
    const playerId = createGamePlayerId();
    const game = createGame({
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
