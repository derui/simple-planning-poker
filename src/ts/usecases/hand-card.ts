import { Card } from "~/src/ts/domains/card";
import { GamePlayerId } from "~/src/ts/domains/game-player";
import { GamePlayerRepository } from "~/src/ts/domains/game-player-repository";
import { EventDispatcher, UseCase } from "./base";

export interface HandCardUseCaseInput {
  playerId: GamePlayerId;
  card: Card;
}

export type HandCardUseCaseOutput = { kind: "success" } | { kind: "notFoundGamePlayer" };

export class HandCardUseCase implements UseCase<HandCardUseCaseInput, Promise<HandCardUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gamePlayerRepository: GamePlayerRepository) {}

  async execute(input: HandCardUseCaseInput): Promise<HandCardUseCaseOutput> {
    const player = await this.gamePlayerRepository.findBy(input.playerId);
    if (!player) {
      return { kind: "notFoundGamePlayer" };
    }

    const event = player.takeHand(input.card);
    this.gamePlayerRepository.save(player);
    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
