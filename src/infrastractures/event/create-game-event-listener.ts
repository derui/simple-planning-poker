import { Database, ref, update } from "firebase/database";
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
    const updates = {
      [`${targetRef}/${event.gameId}`]: { name: event.name, relation: "owner" },
    };

    await update(ref(this.database), updates);
  }
}
