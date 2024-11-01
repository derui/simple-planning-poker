import { Branded, Unbranded } from "./type.js";

const _tag: unique symbol = Symbol("StoryPoint");
export type T = Branded<number, typeof _tag>;

export const create = (v: number): T => {
  if (!isValid(v)) {
    throw new Error("Can not create story point");
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return v as T;
};

export const value = (v: T): Unbranded<T, typeof _tag> => v;

export const isValid = (v: number): boolean => {
  return v >= 0 && !isNaN(v);
};

export const isEqual = (v1: T, v2: T): boolean => v1 == v2;

export const compare = (v1: T, v2: T): number => {
  if (isEqual(v1, v2)) {
    return 0;
  } else if (v1 > v2) {
    return 1;
  } else {
    return -1;
  }
};
