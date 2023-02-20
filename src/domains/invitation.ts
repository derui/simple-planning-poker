import { GameId } from "./game";
import sha256 from "crypto-js/sha256";

export type InvitationSignature = string;

export interface Invitation {
  gameId: GameId;
  signature: InvitationSignature;
}

export const createInvitation = (gameId: GameId): Invitation => {
  const hash = sha256(gameId);
  return {
    gameId,
    signature: hash.toString(),
  };
};
