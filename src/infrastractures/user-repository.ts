import * as User from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { Database, get, ref, update } from "firebase/database";

export class UserRepositoryImpl implements UserRepository {
  constructor(private database: Database) {}

  save(user: User.T): void {
    const databaseRef = ref(this.database);
    const updates: { [key: string]: any } = {};
    updates[`users/${user.id}/name`] = user.name;

    update(databaseRef, updates);
  }

  async findBy(id: User.Id): Promise<User.T | undefined> {
    const snapshot = await get(ref(this.database, `users/${id}`));
    const val = snapshot.val();

    if (!val) {
      return undefined;
    }
    const name = val["name"] as string;

    return User.create({ id, name });
  }
}
