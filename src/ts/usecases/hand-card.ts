import { Card } from "@/domains/card";
import { GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { UserId } from "@/domains/user";
import { EventDispatcher, UseCase } from "./base";

export interface HandCardUseCaseInput {
  gameId: GameId;
  userId: UserId;
  card: Card;
}

export type HandCardUseCaseOutput = { kind: "success" } | { kind: "notFoundGame" };

export class HandCardUseCase implements UseCase<HandCardUseCaseInput, HandCardUseCaseOutput> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  execute(input: HandCardUseCaseInput): HandCardUseCaseOutput {
    const game = this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    const event = game.acceptHandBy(input.userId, input.card);
    this.gameRepository.save(game);
    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
