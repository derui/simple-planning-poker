import sha256 from "crypto-js/sha256";
import { Branded } from "./type";

const _tag = Symbol("InvitationSignature");
export type T = Branded<string, typeof _tag>;

export const create = (base: string): T => {
  const hash = sha256(base);

  return hash.toString() as T;
};
