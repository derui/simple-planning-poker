import * as UserEstimation from "@/domains/user-estimation";
import * as User from "@/domains/user";
import * as SelectableCards from "@/domains/selectable-cards";

/**
 * A simple interface for round history.
 */
export interface T {
  readonly theme: string;
  readonly finishedAt: string;
  readonly id: string;
  readonly cards: SelectableCards.T;
  readonly estimations: Record<User.Id, UserEstimation.T>;
}

export interface Query {
  /**
   * list round histories of the game.
   *
   * Argument `options` is optional. Count in `options` must be greater than 0, and page is too.
   */
  listOf(gameId: string, options?: { count: number; page: number }): T | null;
}
