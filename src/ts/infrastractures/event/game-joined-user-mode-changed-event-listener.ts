import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { Database, onValue, ref, update } from "firebase/database";
import { DomainEventListener } from "./domain-event-listener";

export class GameJoinedUserModeChangedEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind === DOMAIN_EVENTS.GameJoinedUserModeChanged) {
      const unsubscribe = onValue(ref(this.database, `users/${event.userId}`), (snapshot) => {
        const user = snapshot.val();
        if (!user) {
          return;
        }

        const games = user["joinedGames"] || {};
        const updates: { [key: string]: any } = {};
        Object.keys(games).forEach((key) => {
          updates[`games/${key}/users/${event.userId}/mode`] = event.mode;
        });

        update(ref(this.database), updates);
        unsubscribe();
      });
    }

    return;
  }
}
