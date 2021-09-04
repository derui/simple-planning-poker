import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { serializeCard } from "../card-converter";
import { child, Database, ref, set } from "firebase/database";

export class UserCardSelectedEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.UserCardSelected) {
      const gameRef = ref(this.database, `games/${event.gameId}`);

      set(child(gameRef, `userHands/${event.userId}`), serializeCard(event.card));
    }

    return;
  }
}
