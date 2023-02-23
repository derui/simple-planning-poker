import { Id } from "./game";
import sha256 from "crypto-js/sha256";
import { Branded } from "./type";

const tag = Symbol("InvitationSignature");
export type InvitationSignature = Branded<string, typeof tag>;

export interface T {
  readonly gameId: Id;
  readonly signature: InvitationSignature;
}

export const create = (gameId: Id): T => {
  const hash = sha256(gameId);
  return {
    gameId,
    signature: hash.toString() as InvitationSignature,
  };
};
