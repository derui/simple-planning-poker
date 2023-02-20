import { User, UserId } from "./user";

export interface UserRepository {
  // save user
  save(user: User): void;

  // find user by id
  findBy(id: UserId): Promise<User | undefined>;
}
