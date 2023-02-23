import { GameObserver } from "@/contexts/observer";
import { T, Id } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { Database, ref, onValue, Unsubscribe } from "firebase/database";

export class GameObserverImpl implements GameObserver {
  private _unsubscribe: Unsubscribe | null = null;
  private subscribingGameId: Id | null = null;
  constructor(private database: Database, private gameRepository: GameRepository) {}

  subscribe(gameId: Id, subscriber: (game: T) => void): void {
    this.subscribingGameId = gameId;
    const _subscriber = async () => {
      const game = await this.gameRepository.findBy(gameId);
      if (!game) {
        return;
      }

      subscriber(game);
    };

    this._unsubscribe = onValue(ref(this.database, `games/${gameId}`), _subscriber);
  }

  unsubscribe(): void {
    if (this._unsubscribe && this.subscribingGameId) {
      this._unsubscribe();
    }
  }
}
