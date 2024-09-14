import { DomainEventListener } from "./domain-event-listener.js";
import { Game, DomainEvent, VotingRepository, Voting, Estimations } from "@spp/shared-domain";

/**
 * create round with new id
 */
export class CreateRoundAfterCreateGameListener implements DomainEventListener {
  constructor(private votingRepository: VotingRepository.T) {}

  async handle(event: DomainEvent.T): Promise<void> {
    if (!Game.isGameCreated(event)) {
      return;
    }

    const voting = Voting.votingOf({
      id: event.voting,
      points: event.applicablePoints,
      estimations: Estimations.create([event.owner]),
    });

    await this.votingRepository.save(voting);
  }
}
