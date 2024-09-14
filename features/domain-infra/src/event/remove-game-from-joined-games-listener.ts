import { Database, get, ref, update } from "firebase/database";
import { joinedGames } from "../user-ref-resolver.js";
import { DomainEventListener } from "./domain-event-listener.js";
import { Game, DomainEvent } from "@spp/shared-domain";

type JoinedGame = {
  gameId: Game.Id;
  relation: "owner" | "player";
};

const isJoinedGame = function isJoinedGame(val: unknown): val is Record<string, JoinedGame> {
  return !!val;
};

/**
 * update created game as joined game
 */
export class RemoveGameFromJoinedGameListener implements DomainEventListener {
  constructor(private database: Database) {}

  async handle(event: DomainEvent.T): Promise<void> {
    if (!Game.isUserLeftFromGame(event)) {
      return;
    }

    const targetRef = joinedGames(event.userId);
    const snapshot = await get(ref(this.database, targetRef));

    const val: unknown = snapshot.val();
    if (!isJoinedGame(val)) {
      return;
    }

    const updater = Object.entries(val).reduce<Record<string, unknown>>((accum, [key, value]) => {
      if (value.gameId != event.gameId) {
        accum[key] = value;
      }

      return accum;
    }, {});

    await update(ref(this.database, targetRef), updater);
  }
}
