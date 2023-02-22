import { T, Id } from "./user";

export interface UserRepository {
  // save user
  save(user: T): void;

  // find user by id
  findBy(id: Id): Promise<T | undefined>;
}
