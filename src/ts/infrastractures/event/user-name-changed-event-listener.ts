import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { Database, ref, update, get } from "firebase/database";
import { DomainEventListener } from "./domain-event-listener";

export class UserNameChangedEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserNameChanged) {
      get(ref(this.database, `users/${event.userId}`)).then((snapshot) => {
        const user = snapshot.val();
        if (!user) {
          return;
        }

        const games = user["joinedGames"] || {};
        const updates: { [key: string]: any } = {};
        Object.keys(games).forEach((key) => {
          updates[`games/${key}/users/${event.userId}/name`] = event.name;
        });

        update(ref(this.database), updates);
      });
    }

    return;
  }
}
