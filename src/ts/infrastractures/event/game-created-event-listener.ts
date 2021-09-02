import firebase from "firebase";
import { DefinedDomainEvents, DOMAIN_EVENTS } from "@/domains/event";
import { DomainEventListener } from "./domain-event-listener";
import { UserMode } from "@/domains/game-joined-user";

export class GameCreatedEventListener implements DomainEventListener {
  constructor(private database: firebase.database.Database) {}

  handle(event: DefinedDomainEvents): void {
    if (event.kind == DOMAIN_EVENTS.GameCreated) {
      const ref = this.database.ref();
      const updates: { [key: string]: any } = {};
      const { userId, name } = event.createdBy;
      updates[`games/${event.gameId}/users/${userId}/name`] = name;
      updates[`games/${event.gameId}/users/${userId}/mode`] = UserMode.normal;
      updates[`users/${userId}/joinedGames/${event.gameId}`] = true;

      ref.update(updates);
    }
  }
}
