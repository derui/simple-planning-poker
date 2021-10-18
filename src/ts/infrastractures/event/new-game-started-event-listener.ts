import { DefinedDomainEvents, DOMAIN_EVENTS } from "~/src/ts/domains/event";
import { child, Database, ref, remove, set } from "firebase/database";
import { DomainEventListener } from "./domain-event-listener";

export class NewGameStartedEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind === DOMAIN_EVENTS.NewGameStarted) {
      const game = ref(this.database, `games/${event.gameId}`);

      remove(child(game, "userHands"));
      set(child(game, "showedDown"), false);
    }

    return;
  }
}
