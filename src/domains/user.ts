import produce from "immer";
import * as Base from "./base";
import { DomainEvent, DOMAIN_EVENTS } from "./event";

export type Id = Base.Id<"User">;

export const createId = (value?: string): Id => {
  if (value) {
    return value as Id;
  } else {
    return Base.create<"User">();
  }
};

export interface T {
  readonly id: Id;
  readonly name: string;
}

export interface UserNameChanged extends DomainEvent {
  readonly kind: "UserNameChanged";
  userId: Id;
  name: string;
}

/**
   create user from id and name
 */
export const create = ({ id, name }: { id: Id; name: string }): T => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }

  return {
    id,
    name,
  };
};

export const canChangeName = (name: string) => {
  return name !== "";
};

export const changeName = (user: T, name: string): [T, DomainEvent] => {
  if (!canChangeName(name)) {
    throw new Error("can not change name");
  }

  const event: UserNameChanged = {
    kind: DOMAIN_EVENTS.UserNameChanged,
    userId: user.id,
    name: name.trim(),
  };

  return [
    produce(user, (draft) => {
      draft.name = name.trim();
    }),
    event,
  ];
};
