import { Game, User, Voting } from "@spp/shared-domain";

export interface GameObserver {
  subscribe(gameId: Game.Id, subscriber: (game: Game.T) => void): void;

  /**
   * unsubscribe **all* subscriptions
   */
  unsubscribe(): void;
}

export interface VotingObserver {
  subscribe(votingId: Voting.Id, subscriber: (voting: Voting.T) => void): void;

  /**
   * unsubscribe **all** subscriptions
   */
  unsubscribe(): void;
}

export interface UserObserver {
  subscribe(id: User.Id, subscriber: (user: User.T, joinedGames: Game.T[]) => void): void;

  /**
   * unsubscribe **all** subscriptions.
   */
  unsubscribe(): void;
}
