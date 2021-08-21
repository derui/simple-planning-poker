import firebase from "firebase";
import { User, UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";

export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  constructor(private database: firebase.database.Database) {}

  save(user: User): void {
    const ref = this.database.ref(`users/${user.id}/name`);
    ref.set(user.name);

    this.users = this.users.filter((v) => v.id !== user.id).concat(user);
  }

  findBy(id: UserId): User | undefined {
    return this.users.find((v) => v.id === id);
  }
}
