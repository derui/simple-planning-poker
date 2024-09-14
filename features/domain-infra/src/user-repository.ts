import { Database, get, ref, update } from "firebase/database";
import * as UserRefResolver from "./user-ref-resolver.js";
import { User, UserRepository } from "@spp/shared-domain";
import { filterUndefined } from "@spp/shared-basic";

type UserData = {
  name: string;
};

const isUserData = function isUserData(val: unknown): val is UserData {
  return !!val;
};

export class UserRepositoryImpl implements UserRepository.T {
  constructor(private database: Database) {}

  async listIn(ids: User.Id[]): Promise<User.T[]> {
    const users = await Promise.all(ids.map((v) => this.findBy(v)));

    return users.filter(filterUndefined);
  }

  async save(user: User.T): Promise<void> {
    const databaseRef = ref(this.database);
    const updates: Record<string, unknown> = {};
    updates[UserRefResolver.name(user.id)] = user.name;

    await update(databaseRef, updates);
  }

  async findBy(id: User.Id): Promise<User.T | undefined> {
    const snapshot = await get(ref(this.database, `users/${id}`));
    const val: unknown = snapshot.val();

    if (!isUserData(val)) {
      return undefined;
    }
    const name = val.name;

    return User.create({ id, name });
  }
}
