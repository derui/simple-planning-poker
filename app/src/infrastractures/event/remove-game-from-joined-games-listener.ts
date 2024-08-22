import { Database, get, ref, update } from "firebase/database";
import { joinedGames } from "../user-ref-resolver";
import { DomainEventListener } from "./domain-event-listener";
import { isUserLeftFromGame } from "@/domains/game";
import { DomainEvent } from "@/domains/event";
import * as Game from "@/domains/game";
import { JoinedGameState } from "@/domains/game-repository";

/**
 * update created game as joined game
 */
export class RemoveGameFromJoinedGameListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent): Promise<void> {
    if (!isUserLeftFromGame(event)) {
      return;
    }

    const targetRef = joinedGames(event.userId);
    const snapshot = await get(ref(this.database, targetRef));

    const val: Record<string, { gameId: Game.Id }> = snapshot.val();
    if (!val) {
      return;
    }

    const updater = Object.entries(val).reduce<Record<string, unknown>>((accum, [key, value]) => {
      if (value.gameId === event.gameId) {
        accum[key] = { ...value, state: JoinedGameState.left };
      } else {
        accum[key] = value;
      }

      return accum;
    }, {});

    await update(ref(this.database, targetRef), updater);
  }
}
