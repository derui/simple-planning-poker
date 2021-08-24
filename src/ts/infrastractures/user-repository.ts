import firebase from "firebase";
import { createUser, User, UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";

export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  constructor(private database: firebase.database.Database) {}

  save(user: User): void {
    const ref = this.database.ref(`users/${user.id}/name`);
    ref.set(user.name);

    this.users = this.users.filter((v) => v.id !== user.id).concat(user);
  }

  async findBy(id: UserId): Promise<User | undefined> {
    const snapshot = await this.database.ref(`users/${id}/name`).once("value");
    const val = snapshot.val();

    if (!val) {
      return undefined;
    }
    const name = val.name as string;

    return createUser(id, name);
  }
}
