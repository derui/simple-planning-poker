import { type VotingRepository as I } from "../voting-repository.js";
import * as Voting from "../voting.js";

/**
 * In-memory data
 */
const data = new Map<Voting.Id, Voting.T>();
let errorOnSave: string | undefined = undefined;

/**
 * Clear test data
 */
export const clear = (): void => {
  data.clear();
  errorOnSave = undefined;
};

/**
 * Inject error on save
 */
export const injectErrorOnSave = (error: string): void => {
  errorOnSave = error;
};

/**
 * Make In-memory version `VotingRepository.T` for testing purpose.
 */
export const VotingRepository: I = {
  save: ({ voting }) => {
    if (errorOnSave !== undefined) {
      throw new Error(errorOnSave);
    }

    data.set(voting.id, voting);

    return Promise.resolve();
  },

  findBy: ({ id }) => {
    return Promise.resolve(data.get(id));
  },
};
