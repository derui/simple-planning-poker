import firebase from "firebase";
import { createUser, User, UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";

export class UserRepositoryImpl implements UserRepository {
  constructor(private database: firebase.database.Database) {}

  save(user: User): void {
    const ref = this.database.ref(`users/${user.id}`);
    const updates: { [key: string]: any } = {};
    updates["name"] = user.name;

    ref.update(updates);
  }

  async findBy(id: UserId): Promise<User | undefined> {
    const snapshot = await this.database.ref(`users/${id}/name`).once("value");
    const val = snapshot.val();

    if (!val) {
      return undefined;
    }
    const name = val as string;

    return createUser(id, name);
  }
}
