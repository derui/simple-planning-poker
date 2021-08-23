import firebase from "firebase";
import { GameObserver } from "@/contexts/observer";
import { Game, GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";

export class GameObserverImpl implements GameObserver {
  private cancelSubscriber: ((snapshot: firebase.database.DataSnapshot) => void) | null = null;
  private subscribingGameId: GameId | null = null;
  constructor(private database: firebase.database.Database, private gameRepository: GameRepository) {}

  subscribe(gameId: GameId, subscriber: (game: Game) => void): void {
    this.subscribingGameId = gameId;
    this.cancelSubscriber = async () => {
      const game = await this.gameRepository.findBy(gameId);
      if (!game) {
        return;
      }

      subscriber(game);
    };

    this.database.ref(`games/${gameId}`).on("value", this.cancelSubscriber);
  }

  unsubscribe(): void {
    if (this.cancelSubscriber && this.subscribingGameId) {
      this.database.ref(`games/${this.subscribingGameId}`).off("value", this.cancelSubscriber);
    }
  }
}
