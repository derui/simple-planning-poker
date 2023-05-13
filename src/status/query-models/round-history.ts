/**
 * A simple interface for round history.
 */
export interface T {
  readonly theme: string | null;
  readonly finishedAt: string;
  readonly averagePoint: number;
  readonly id: string;
}

export interface Query {
  /**
   * list round histories of the game.
   *
   * A `lastKey` attribute in `options` should be `key` of result.
   */
  listBy(gameId: string, options: { count: number; lastKey?: string }): Promise<{ result: T[]; key: string }>;
}
