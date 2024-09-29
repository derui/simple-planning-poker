import * as Voting from "./voting.js";

/**
 * A respository for round
 */
export interface T {
  /**
   * find a round by id
   */
  findBy(id: Voting.Id): Promise<Voting.T | undefined>;

  /**
   * save a round
   */
  save(obj: Voting.T): Promise<void>;
}
