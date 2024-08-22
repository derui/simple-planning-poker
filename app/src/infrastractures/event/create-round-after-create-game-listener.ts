import { DomainEventListener } from "./domain-event-listener";
import { isGameCreated } from "@/domains/game";
import { DomainEvent } from "@/domains/event";
import { RoundRepository } from "@/domains/round-repository";
import { roundOf } from "@/domains/round";

/**
 * create round with new id
 */
export class CreateRoundAfterCreateGameListener implements DomainEventListener {
  constructor(private roundRepository: RoundRepository) {}

  async handle(event: DomainEvent): Promise<void> {
    if (!isGameCreated(event)) {
      return;
    }

    const round = roundOf({
      id: event.round,
      cards: event.selectableCards,
    });

    await this.roundRepository.save(round);
  }
}
