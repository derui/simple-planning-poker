import * as R from "../voting-repository.js";
import * as Voting from "../voting.js";

/**
 * Make In-memory version `VotingRepository.T` for testing purpose.
 */
export const newMemoryVotingRepository = function newMemoryVotingRepository(
  initial: Record<Voting.Id, Voting.T> = {}
): R.T {
  const data = new Map<Voting.Id, Voting.T>(Object.entries(initial).map(([k, v]) => [Voting.createId(k), v]));

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
