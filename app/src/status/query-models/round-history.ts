import { calculateAverage, FinishedRound } from "@/domains/round";

/**
 * A simple interface for round history.
 */
export interface T {
  readonly theme: string | null;
  readonly finishedAt: string;
  readonly averagePoint: number;
  readonly id: string;
}

/**
 * convert `FinishedRound` to `T`
 */
export const fromFinishedRound = function fromFinishedRound(round: FinishedRound): T {
  return {
    theme: round.theme,
    finishedAt: round.finishedAt,
    averagePoint: calculateAverage(round),
    id: round.id,
  };
};

export interface Query {
  /**
   * list round histories of the game.
   *
   * A `lastKey` attribute in `options` should be `key` of result.
   */
  listBy(gameId: string, options: { count: number; lastKey?: string }): Promise<{ result: T[]; key: string }>;
}
