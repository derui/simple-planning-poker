import { T, Id } from "./user.js";

export interface UserRepository {
  /**
   * Save user state
   */
  save(user: T): Promise<void>;

  /**
   * Find user by ID
   */
  findBy(id: Id): Promise<T | undefined>;

  /**
   * List users in list of identifiers
   */
  listIn(ids: Id[]): Promise<T[]>;
}
