import { T } from "@/domains/card";
import { Id } from "@/domains/game-player";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { EventDispatcher, UseCase } from "./base";

export interface HandCardUseCaseInput {
  playerId: Id;
  card: T;
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
