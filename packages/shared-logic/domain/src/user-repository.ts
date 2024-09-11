import * as User from "./user.js";

export interface T {
  /**
   * Save user state
   */
  save(user: User.T): Promise<void>;

  /**
   * Find user by ID
   */
  findBy(id: User.Id): Promise<User.T | undefined>;

  /**
   * List users in list of identifiers
   */
  listIn(ids: User.Id[]): Promise<User.T[]>;
}
