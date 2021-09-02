import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";

export class UserNameChangedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserNameChanged) {
      this.database
        .ref(`users/${event.userId}`)
        .once("value")
        .then((ref) => {
          const user = ref.val();
          if (!user) {
            return;
          }

          const games = user["joinedGames"] || {};
          const updates: { [key: string]: any } = {};
          Object.keys(games).forEach((key) => {
            updates[`games/${key}/users/${event.userId}/name`] = event.name;
          });

          this.database.ref().update(updates);
        });
    }

    return;
  }
}
