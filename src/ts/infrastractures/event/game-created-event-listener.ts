import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { UserMode } from "@/domains/game-joined-user";
import { Database, ref, update } from "firebase/database";

export class GameCreatedEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameCreated) {
      const updates: { [key: string]: any } = {};
      const { userId, name } = event.createdBy;
      updates[`games/${event.gameId}/users/${userId}/name`] = name;
      updates[`games/${event.gameId}/users/${userId}/mode`] = UserMode.normal;
      updates[`users/${userId}/joinedGames/${event.gameId}`] = true;

      update(ref(this.database), updates);
    }
  }
}
