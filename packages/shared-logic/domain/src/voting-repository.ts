import * as Voting from "./voting.js";

/**
 * A respository for round
 */
export interface VotingRepository {
  /**
   * find a round by id
   */
  findBy: VotingRepository.FindBy;

  /**
   * save a round
   */
  save: VotingRepository.Save;
}

/**
 * A default instance of VotingRepository.
 *
 * This is a stub to be replaced with a real implementation.
 */
export const VotingRepository: VotingRepository = {
  findBy: function () {
    throw new Error("Function not implemented.");
  },
  save: function () {
    throw new Error("Function not implemented.");
  },
};

export namespace VotingRepository {
  export namespace FindBy {
    export interface Params {
      id: Voting.Id;
    }

    export type Result = Voting.T | undefined;
  }

  export type FindBy = (params: FindBy.Params) => Promise<FindBy.Result>;

  export namespace Save {
    export interface Params {
      voting: Voting.T;
    }

    export type Result = void;
  }

  export type Save = (params: Save.Params) => Promise<Save.Result>;
}
