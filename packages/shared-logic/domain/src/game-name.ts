import { Branded, Unbranded } from "./type.js";

const _tag: unique symbol = Symbol("GameName");
export type T = Branded<string, typeof _tag>;

export const create = (v: string): T => {
  if (!isValid(v)) {
    throw new Error("Can not create game name");
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return v.trim() as T;
};

export const value = (v: T): Unbranded<T, typeof _tag> => v;

export const isValid = (v: string): boolean => {
  return v.trim().length > 0;
};

export const isEqual = (v1: T, v2: T): boolean => v1 == v2;

export const compare = (v1: T, v2: T): number => {
  return v1.localeCompare(v2);
};
