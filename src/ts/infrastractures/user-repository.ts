import { createUser, User, UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { Database, get, ref, update } from "firebase/database";

export class UserRepositoryImpl implements UserRepository {
  constructor(private database: Database) {}

  save(user: User): void {
    const databaseRef = ref(this.database, `users/${user.id}`);
    const updates: { [key: string]: any } = {};
    updates["name"] = user.name;

    update(databaseRef, updates);
  }

  async findBy(id: UserId): Promise<User | undefined> {
    const snapshot = await get(ref(this.database, `users/${id}`));
    const val = snapshot.val();

    if (!val) {
      return undefined;
    }
    const name = val["name"] as string;

    return createUser({ id, name });
  }
}
