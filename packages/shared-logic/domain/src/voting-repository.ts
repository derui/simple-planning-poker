import * as Voting from "./voting.js";

/**
 * A respository for round
 */
export interface VotingRepositoy {
  /**
   * find a round by id
   */
  findBy(id: Voting.Id): Promise<Voting.T | null>;

  /**
   * save a round
   */
  save(obj: Voting.T): Promise<void>;
}
