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
   * find a finished round by id. If a round of given id do not finish yet, this method return `null`.
   */
  findFinishedRoundBy(id: Round.Id): Promise<Round.FinishedRound | null>;

  /**
   * save a round
   */
  save(obj: Round.T): Promise<void>;
}
