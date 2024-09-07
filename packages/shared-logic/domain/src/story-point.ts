import { Branded } from "./type.js";

const _tag = Symbol("StoryPoint");
export type T = Branded<number, typeof _tag>;

export const create = (v: number): T => {
  if (!isValid(v)) {
    throw new Error("Can not create story point");
  }

  return v as T;
};

export const value = (v: T) => v as number;

export const isValid = (v: number) => {
  return v >= 0 && !isNaN(v);
};

export const isEqual = (v1: T, v2: T) => v1 == v2;

export const compare = (v1: T, v2: T): number => {
  if (isEqual(v1, v2)) {
    return 0;
  } else if (v1 > v2) {
    return 1;
  } else {
    return -1;
  }
};
