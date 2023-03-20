import { Database, ref, onValue, Unsubscribe, DataSnapshot } from "firebase/database";
import { GameObserver } from "./observer";
import { deserializeFrom } from "./game-snapshot-deserializer";
import { T, Id } from "@/domains/game";
import { RoundRepository } from "@/domains/round-repository";

export class GameObserverImpl implements GameObserver {
  private _unsubscribe: Unsubscribe | null = null;
  private subscribingGameId: Id | null = null;
  constructor(private database: Database, private roundRepository: RoundRepository) {}

  subscribe(gameId: Id, subscriber: (game: T) => void): void {
    this.unsubscribe();

    this.subscribingGameId = gameId;
    const _subscriber: (data: DataSnapshot) => void = async (data) => {
      const game = await deserializeFrom(gameId, data, this.roundRepository);

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
