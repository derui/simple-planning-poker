import { filterUndefined } from "@spp/shared-basic";
import * as R from "../user-repository.js";
import * as User from "../user.js";

/**
 * Make In-memory version `UserRepository.T` for testing purpose.
 */
export const newMemoryUserRepository = function newMemoryUserRepository(initial: Record<User.Id, User.T> = {}): R.T {
  const data = new Map<User.Id, User.T>(Object.entries(initial).map(([k, v]) => [User.createId(k), v]));

  return {
    save(voting: User.T) {
      data.set(voting.id, voting);

      return Promise.resolve();
    },

    findBy(id: User.Id) {
      return Promise.resolve(data.get(id));
    },
    listIn(users) {
      return Promise.resolve(users.map((v) => data.get(v)).filter(filterUndefined));
    },
  };
};
