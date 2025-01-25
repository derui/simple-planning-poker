import { v4 } from "uuid";

const _id: unique symbol = Symbol.for("id");
/**
 * The Generic ID type in domain
 */
export type Id<T extends symbol> = string & { [_id]: T };

/**
 * Stringify for `ID` Type
 */
export const toString = <T extends symbol>(v: Id<T>): string =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  v as string;

/**
 * Create new ID with or without identifier. When without identifier,
 * this function generate randomly unique ID.
 */
export const create = <T extends symbol>(constant: string | undefined = undefined): Id<T> =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  (constant || v4()) as Id<T>;

/**
 * Compare two identifiers as generic.
 */
export const isEqual = function isEqual<T extends symbol>(o1: Id<T>, o2: Id<T>): boolean {
  return o1 == o2;
};
