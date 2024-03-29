import { Database, push, ref, set } from "firebase/database";
import { joinedGames } from "../user-ref-resolver";
import { DomainEventListener } from "./domain-event-listener";
import { isUserJoined } from "@/domains/game";
import { DomainEvent } from "@/domains/event";
import { JoinedGameState } from "@/domains/game-repository";

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
    const value = push(ref(this.database, targetRef));

    await set(value, {
      relation: "player",
      gameId: event.gameId,
      state: JoinedGameState.joined,
    });
  }
}
