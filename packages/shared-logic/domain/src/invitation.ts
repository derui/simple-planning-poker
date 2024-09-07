import { SHA256 } from "crypto-js";
import { Branded } from "./type.js";

const _tag = Symbol("InvitationSignature");
export type T = Branded<string, typeof _tag>;

export const create = (base: string): T => {
  const hash = SHA256(base);

  return hash.toString() as T;
};
