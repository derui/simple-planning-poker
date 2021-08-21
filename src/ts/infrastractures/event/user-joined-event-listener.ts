import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";

export class UserJoinedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserJoined) {
      const ref = this.database.ref(`database/${event.gameId}`);

      ref.child("joinedUsers").child(event.userId).set(event.name);
    }

    return;
  }
}
