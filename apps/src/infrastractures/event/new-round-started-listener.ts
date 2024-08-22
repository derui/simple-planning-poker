import { DomainEventListener } from "./domain-event-listener";
import { applyNewRound, isNewRoundStarted } from "@/domains/game";
import { DomainEvent } from "@/domains/event";
import { GameRepository } from "@/domains/game-repository";

/**
 * create round with new id
 */
export class NewRoundStartedListener implements DomainEventListener {
  constructor(private gameRepository: GameRepository) {}

  async handle(event: DomainEvent): Promise<void> {
    if (!isNewRoundStarted(event)) {
      return;
    }

    const game = await this.gameRepository.findBy(event.gameId);
    if (!game) {
      return;
    }

    const changed = applyNewRound(game, event.roundId);

    await this.gameRepository.save(changed);
  }
}
