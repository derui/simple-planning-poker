import { Id } from "./base";

export type UserId = Id<"User">;

export interface User {
  get id(): UserId;
  get name(): string;

  // change name
  changeName(name: string): void;

  // can change name with given value
  canChangeName(name: string): boolean;
}

/**
   create user from id and name
 */
export const createUser = (id: UserId, name: string): User => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }

  return {
    userName: name,
    get id() {
      return id;
    },

    get name() {
      return this.userName;
    },

    changeName(name: string) {
      if (!this.canChangeName(name)) {
        throw new Error("can not change name");
      }
      this.userName = name;
    },

    canChangeName(name: string) {
      return name !== "";
    },
  } as User & { userName: string };
};
