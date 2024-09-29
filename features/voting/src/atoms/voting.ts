import { Voting } from "@spp/shared-domain";
import { atom } from "jotai";
import { EstimationDto, RevealedEstimationDto } from "./dto.js";

/**
 * Atom to store voting id
 */
const currentVotingIdAtom = atom<Voting.Id | undefined>();

/**
 * Definition of hook for voting
 */
export type UseVoting = {
  /**
   * Estimations in voting.
   */
  estimations: EstimationDto[];

  /**
   * Reveal current voting
   */
  reveal(): void;

  /**
   * Change theme with `newTheme`
   */
  changeTheme(newTheme: string): void;
};

/**
 * Definition of hook for revealed voting
 */
export type UseRevealed = {
  /**
   * Estimations in revealed voting
   */
  estimations: RevealedEstimationDto[];

  /**
   * Reset revealed voting
   */
  reset(): void;
};
