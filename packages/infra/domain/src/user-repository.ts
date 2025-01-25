import { filterUndefined } from "@spp/shared-basic";
import { User } from "@spp/shared-domain";
import { type UserRepository as I } from "@spp/shared-domain/user-repository";
import { get, ref, update } from "firebase/database";
import { getDatabase } from "./database.js";
import * as UserRefResolver from "./user-ref-resolver.js";

type UserData = {
  name: string;
};

const isUserData = function isUserData(val: unknown): val is UserData {
  return !!val;
};

const findBy: I.FindBy = async ({ id }) => {
  const snapshot = await get(ref(getDatabase(), `users/${id}`));
  const val: unknown = snapshot.val();

  if (!isUserData(val)) {
    return undefined;
  }
  const name = val.name;

  return User.create({ id, name });
};

export const UserRepository: I = {
  listIn: async ({ users: ids }) => {
    const users = await Promise.all(ids.map((id) => findBy({ id })));

    return users.filter(filterUndefined);
  },

  save: async ({ user }) => {
    const databaseRef = ref(getDatabase());
    const updates: Record<string, unknown> = {};
    updates[UserRefResolver.name(user.id)] = user.name;

    await update(databaseRef, updates);
  },

  findBy,
};
