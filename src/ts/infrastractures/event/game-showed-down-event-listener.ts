import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";

export class GameShowedDownEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameShowedDown) {
      const ref = this.database.ref(`games/${event.gameId}`);

      ref.child("showedDown").transaction((currentData) => {
        if (currentData === null || !currentData) {
          return true;
        } else {
          return;
        }
      });
    }
  }
}
