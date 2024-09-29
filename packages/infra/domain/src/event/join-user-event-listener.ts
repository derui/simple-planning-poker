import { Database, push, ref, set } from "firebase/database";
import { joinedGames } from "../user-ref-resolver.js";
import { DomainEventListener } from "./domain-event-listener.js";
import { Game, DomainEvent } from "@spp/shared-domain";

/**
 * update created game as joined game
 */
export class JoinUserEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent.T): Promise<void> {
    if (!Game.isUserJoined(event)) {
      return;
    }

    const targetRef = joinedGames(event.userId);
    const value = push(ref(this.database, targetRef));

    await set(value, {
      relation: "player",
      gameId: event.gameId,
    });
  }
}
