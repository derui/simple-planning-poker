import { DefinedDomainEvents, DOMAIN_EVENTS } from "~/src/ts/domains/event";
import { Database, ref, runTransaction } from "firebase/database";
import { DomainEventListener } from "./domain-event-listener";

export class GameShowedDownEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameShowedDown) {
      runTransaction(ref(this.database, `games/${event.gameId}/showedDown`), (currentData) => {
        if (currentData === null || !currentData) {
          return true;
        } else {
          return;
        }
      });
    }
  }
}
