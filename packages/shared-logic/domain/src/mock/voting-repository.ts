import { type VotingRepository as I } from "../voting-repository.js";
import * as Voting from "../voting.js";

/**
 * In-memory data
 */
const data = new Map<Voting.Id, Voting.T>();

/**
 * Make In-memory version `VotingRepository.T` for testing purpose.
 */
export const VotingRepository: I = {
  save: ({ voting }) => {
    data.set(voting.id, voting);

    return Promise.resolve();
  },

  findBy: ({ id }) => {
    return Promise.resolve(data.get(id));
  },
};
