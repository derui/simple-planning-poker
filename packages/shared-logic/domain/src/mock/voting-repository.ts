import * as R from "../voting-repository.js";
import * as Voting from "../voting.js";

/**
 * Make In-memory version `VotingRepository.T` for testing purpose.
 */
export const newMemoryVotingRepository = function newMemoryVotingRepository(initial: Voting.T[] = []): R.T {
  const data = new Map<Voting.Id, Voting.T>(initial.map((v) => [v.id, v]));

  return {
    save(voting: Voting.T) {
      data.set(voting.id, voting);

      return Promise.resolve();
    },

    findBy(id: Voting.Id) {
      return Promise.resolve(data.get(id));
    },
  };
};
