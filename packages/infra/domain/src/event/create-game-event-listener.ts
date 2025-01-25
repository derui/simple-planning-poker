import { DomainEvent, Game } from "@spp/shared-domain";
import { push, ref, set } from "firebase/database";
import { getDatabase } from "../database.js";
import { ownerGames } from "../user-ref-resolver.js";
import { DomainEventListener } from "./domain-event-listener.js";

/**
 * update created game as joined game
 */
export class CreateGameEventListener implements DomainEventListener {
  async handle(event: DomainEvent.T): Promise<void> {
    if (!Game.isGameCreated(event)) {
      return;
    }

    const targetRef = ownerGames(event.owner);
    const value = push(ref(getDatabase(), targetRef));

    await set(value, { gameId: event.gameId });
  }
}
