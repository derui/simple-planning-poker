import { RoundHistoryRepository } from "../round-history-repository";
import { DomainEventListener } from "./domain-event-listener";
import { isNewRoundStarted } from "@/domains/game";
import { DomainEvent } from "@/domains/event";
import { RoundRepository } from "@/domains/round-repository";
import { isFinishedRound } from "@/domains/round";

/**
 * record finished round as history
 */
export class FinishedRoundRecordingListener implements DomainEventListener {
  constructor(
    private roundRepository: RoundRepository,
    private roundHistoryRepository: RoundHistoryRepository
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    if (!isNewRoundStarted(event)) {
      return;
    }

    const round = await this.roundRepository.findBy(event.previousRoundId);
    if (!round || !isFinishedRound(round)) {
      return;
    }

    await this.roundHistoryRepository.save(event.gameId, round);
  }
}
