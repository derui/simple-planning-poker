import { EstimationDto } from "./dto.js";

/**
 * status of voting
 */
export enum JoinedVotingStatus {
  Voting = "voting",
  Revealed = "revealed",
  NotJoined = "notJoined",
}

/**
 * Hook to get common attributes at polling place
 */
export type PollingPlace = {
  /**
   * ID of current voting
   */
  id: string;

  /**
   * Estimations in voting.
   */
  estimations: EstimationDto[];

  /**
   * inspectors in voting
   */
  inspectors: EstimationDto[];

  /**
   * theme of current joining voting
   */
  theme: string;

  /**
   * applicable points in this voting
   */
  points: string[];
};
