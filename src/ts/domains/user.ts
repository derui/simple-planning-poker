import { createId, Id } from "./base";
import { EventFactory, UserNameChanged } from "./event";

export type UserId = Id<"User">;

export const createUserId = (value?: string): UserId => {
  if (value) {
    return value as UserId;
  } else {
    return createId<"User">();
  }
};

export interface User {
  get id(): UserId;
  get name(): string;

  // change name
  changeName(name: string): UserNameChanged;

  // can change name with given value
  canChangeName(name: string): boolean;
}

/**
   create user from id and name
 */
export const createUser = ({ id, name }: { id: UserId; name: string }): User => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }

  const obj = {
    _userName: name,
    get id() {
      return id;
    },

    get name() {
      return obj._userName;
    },

    changeName(name: string) {
      if (!obj.canChangeName(name)) {
        throw new Error("can not change name");
      }
      obj._userName = name;

      return EventFactory.userNameChanged(obj.id, name);
    },

    canChangeName(name: string) {
      return name !== "";
    },
  } as User & { _userName: string };

  return obj;
};
