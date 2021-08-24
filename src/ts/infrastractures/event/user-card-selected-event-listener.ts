import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { serializeCard } from "../card-converter";

export class UserCardSelectedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserCardSelected) {
      const ref = this.database.ref(`games/${event.gameId}`);

      ref.child("userHands").child(event.userId).set(serializeCard(event.card));
    }

    return;
  }
}
