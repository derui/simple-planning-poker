import { Database, push, ref, set } from "firebase/database";
import { DomainEventListener } from "./domain-event-listener.js";
import { DomainEvent, Voting, Voter } from "@spp/shared-domain";
import { voter } from "../voting-ref-resolver.js";

/**
 * update created game as joined game
 */
export class JoinUserEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent.T): Promise<void> {
    if (!Voting.isVoterJoined(event)) {
      return;
    }

    const targetRef = voter(event.votingId, event.userId);
    const value = ref(this.database, targetRef);

    await set(value, { type: Voter.VoterType.Normal });
  }
}
