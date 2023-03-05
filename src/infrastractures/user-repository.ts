import { Database, get, ref, update } from "firebase/database";
import * as User from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { filterUndefined } from "@/utils/basic";

export class UserRepositoryImpl implements UserRepository {
  constructor(private database: Database) {}

  async listIn(ids: User.Id[]): Promise<User.T[]> {
    const users = await Promise.all(ids.map(this.findBy));

    return users.filter(filterUndefined);
  }

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
