import * as Round from "./round";

/**
 * A respository for round
 */
export interface RoundRepository {
  /**
   * find a round by id
   */
  findBy(id: Round.Id): Promise<Round.T | null>;

  /**
   * save a round
   */
  save(obj: Round.T): Promise<void>;
}
