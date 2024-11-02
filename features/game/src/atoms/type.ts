/**
 * status of Vote starting
 */
export enum VoteStartingStatus {
  Started = "started",
  Starting = "starting",
}

/**
 * Status enum of game creating
 */
export enum CreateGameStatus {
  /**
   * Completed state is completed to create a game
   */
  Completed = "completed",

  /**
   * Failed state is failed to create a game
   */
  Failed = "failed",

  /**
   * Waiting state is waiting to finish creating a game
   */
  Waiting = "waiting",
}
