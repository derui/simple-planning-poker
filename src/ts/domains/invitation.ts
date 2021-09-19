import { GameId } from "./game";
import * as crypto from "crypto";

export type InvitationSignature = string;

export interface Invitation {
  gameId: GameId;
  signature: InvitationSignature;
}

export const createInvitation = (gameId: GameId): Invitation => {
  const hash = crypto.createHash("sha256");
  return {
    gameId,
    signature: hash.update(gameId).digest("hex"),
  };
};
