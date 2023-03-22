import { Database, push, ref, set } from "firebase/database";
import { joinedGames } from "../user-ref-resolver";
import { DomainEventListener } from "./domain-event-listener";
import { isGameCreated } from "@/domains/game";
import { DomainEvent } from "@/domains/event";

/**
 * update created game as joined game
 */
export class CreateGameEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent): Promise<void> {
    if (!isGameCreated(event)) {
      return;
    }

    const targetRef = joinedGames(event.owner);
    const value = push(ref(this.database, targetRef));

    await set(value, { gameId: event.gameId, relation: "owner" });
  }
}
