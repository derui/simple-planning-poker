import { SHA256 } from "crypto-js";
import { Branded, Unbranded } from "./type.js";

const _tag: unique symbol = Symbol("InvitationSignature");
export type T = Branded<string, typeof _tag>;

export const create = (base: string): T => {
  const hash = SHA256(base);

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return hash.toString() as T;
};

/**
 * Get value from invitation type.
 */
export const value = function value(obj: T): Unbranded<T, typeof _tag> {
  return obj;
};
