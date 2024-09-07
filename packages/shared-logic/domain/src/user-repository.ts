import { T, Id } from "./user.js";

export interface UserRepository {
  // save user
  save(user: T): Promise<void>;

  // find user by id
  findBy(id: Id): Promise<T | undefined>;

  // find user by id
  listIn(ids: Id[]): Promise<T[]>;
}
