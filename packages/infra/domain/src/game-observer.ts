import { Database, ref, onValue, Unsubscribe, DataSnapshot } from "firebase/database";
import { GameObserver } from "./observer.js";
import { deserializeFrom } from "./game-snapshot-deserializer.js";
import { Game } from "@spp/shared-domain";

export class GameObserverImpl implements GameObserver {
  private _unsubscribe: Unsubscribe | null = null;
  private subscribingGameId: Game.Id | null = null;
  constructor(private database: Database) {}

  subscribe(gameId: Game.Id, subscriber: (game: Game.T) => void): void {
    this.unsubscribe();

    this.subscribingGameId = gameId;
    const _subscriber: (data: DataSnapshot) => void = (data) => {
      const game = deserializeFrom(gameId, data);

      if (!game) {
        return;
      }

      subscriber(game);
    };

    this._unsubscribe = onValue(ref(this.database, `games/${gameId}/`), _subscriber);
  }

  unsubscribe(): void {
    if (this._unsubscribe && this.subscribingGameId) {
      this._unsubscribe();
      this._unsubscribe = null;
      this.subscribingGameId = null;
    }
  }
}
