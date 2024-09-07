import { produce } from "immer";
import * as Base from "./base.js";
import { DomainEvent, DOMAIN_EVENTS } from "./event.js";
import { Branded } from "./type.js";

const _tag: unique symbol = Symbol();
type tag = typeof _tag;
export type Id = Base.Id<tag>;

export const createId = (value?: string): Id => {
  if (value) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return value as Id;
  } else {
    return Base.create<tag>();
  }
};

interface Internal {
  readonly id: Id;
  readonly name: string;
}

export type T = Branded<Internal, tag>;

export interface UserNameChanged extends DomainEvent {
  readonly kind: DOMAIN_EVENTS.UserNameChanged;
  readonly userId: Id;
  readonly newName: string;
}

/**
   create user from id and name
 */
export const create = ({ id, name }: { id: Id; name: string }): T => {
  if (name === "") {
    throw new Error("can not create user with empty name");
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    id,
    name,
  } as T;
};

/**
 * Compare two User is same.
 */
export const isEqual = function isEqual(o1: T, o2: T): boolean {
  return o1.id === o2.id;
};

/**
 * Return given name is changed to or not
 */
export const canChangeName = (name: string) => {
  return name.trim() !== "";
};

export const isUserNameChanged = function isUserNameChanged(obj: DomainEvent): obj is UserNameChanged {
  return obj.kind == DOMAIN_EVENTS.UserNameChanged;
};

export const changeName = (user: T, name: string): [T, DomainEvent] => {
  if (!canChangeName(name)) {
    throw new Error("can not change name");
  }

  const event: UserNameChanged = {
    kind: DOMAIN_EVENTS.UserNameChanged,
    userId: user.id,
    newName: name.trim(),
  };

  return [
    produce(user, (draft) => {
      draft.name = name.trim();
    }),
    event,
  ];
};
