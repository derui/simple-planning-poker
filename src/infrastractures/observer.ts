import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";

export interface GameObserver {
  subscribe(gameId: Game.Id, subscriber: (game: Game.T) => void): void;

  unsubscribe(): void;
}

export interface RoundObserver {
  subscribe(gameId: Round.Id, subscriber: (round: Round.T) => void): void;

  unsubscribe(): void;
}

export interface UserObserver {
  subscribe(id: User.Id, subscriber: (user: User.T) => void): void;

  /**
   * unsubscribe *all* subscriptions.
   */
  unsubscribe(): void;
}
