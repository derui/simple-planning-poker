import { filterUndefined } from "@spp/shared-basic";
import { type UserRepository as I } from "../user-repository.js";
import * as User from "../user.js";

/**
 * In-memory version `UserRepository.T` for testing purpose.
 */
const data = new Map<User.Id, User.T>();
/**
 * Clear test data
 */
export const clear = (): void => {
  data.clear();
};

/**
 * Make In-memory version `UserRepository.T` for testing purpose.
 */
export const UserRepository: I = {
  save: ({ user }) => {
    data.set(user.id, user);

    return Promise.resolve();
  },

  findBy: ({ id }) => {
    return Promise.resolve(data.get(id));
  },
  listIn: ({ users }) => {
    return Promise.resolve(users.map((v) => data.get(v)).filter(filterUndefined));
  },
};
