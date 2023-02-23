import * as Card from "@/domains/card";
import * as GamePlayer from "@/domains/game-player";
import * as SelectableCards from "@/domains/selectable-cards";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { EventDispatcher, UseCase } from "./base";

export interface HandCardUseCaseInput {
  playerId: GamePlayer.Id;
  card: Card.T;
  selectableCards: SelectableCards.T;
}

export type HandCardUseCaseOutput = { kind: "success" } | { kind: "notFoundGamePlayer" };

export class HandCardUseCase implements UseCase<HandCardUseCaseInput, Promise<HandCardUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gamePlayerRepository: GamePlayerRepository) {}

  async execute(input: HandCardUseCaseInput): Promise<HandCardUseCaseOutput> {
    const player = await this.gamePlayerRepository.findBy(input.playerId);
    if (!player) {
      return { kind: "notFoundGamePlayer" };
    }

    const [newPlayer, event] = GamePlayer.takeHand(player, input.card, input.selectableCards);
    this.gamePlayerRepository.save(newPlayer);
    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
