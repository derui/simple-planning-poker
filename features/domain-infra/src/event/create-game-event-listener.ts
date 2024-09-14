import { Database, push, ref, set } from "firebase/database";
import { joinedGames } from "../user-ref-resolver.js";
import { DomainEventListener } from "./domain-event-listener.js";
import { Game, DomainEvent } from "@spp/shared-domain";

/**
 * update created game as joined game
 */
export class CreateGameEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent.T): Promise<void> {
    if (!Game.isGameCreated(event)) {
      return;
    }

    const targetRef = joinedGames(event.owner);
    const value = push(ref(this.database, targetRef));

    await set(value, { gameId: event.gameId, relation: "owner" });
  }
}
