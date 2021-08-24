import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";

export class UserJoinedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserJoined) {
      const ref = this.database.ref(`games/${event.gameId}`);

      ref.child("users").child(event.userId).set(true);
    }

    return;
  }
}
