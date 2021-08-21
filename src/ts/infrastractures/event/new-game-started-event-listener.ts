import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";

export class NewGameStartedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.NewGameStarted) {
      const ref = this.database.ref(`database/${event.gameId}`);

      ref.child("userHands").remove();
      ref.child("showedDown").set(false);
    }

    return;
  }
}
