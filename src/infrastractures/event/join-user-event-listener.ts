import { Database, ref, update } from "firebase/database";
import { joinedGames } from "../user-ref-resolver";
import { DomainEventListener } from "./domain-event-listener";
import { isUserJoined } from "@/domains/game";
import { DomainEvent } from "@/domains/event";

/**
 * update created game as joined game
 */
export class JoinUserEventListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent): Promise<void> {
    if (!isUserJoined(event)) {
      return;
    }

    const targetRef = joinedGames(event.userId);
    const updates = {
      [`${targetRef}/${event.gameId}`]: { relation: "player" },
    };

    await update(ref(this.database), updates);
  }
}
