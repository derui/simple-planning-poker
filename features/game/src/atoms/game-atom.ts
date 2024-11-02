import { Game } from "@spp/shared-domain";
import { atom, PrimitiveAtom } from "jotai";
import { VoteStartingStatus } from "./type.js";

/**
 * games that are owned by or joined by an user
 */
export const gamesAtom: PrimitiveAtom<Game.T[]> = atom<Game.T[]>([]);

/**
 * Atom to store starting vote
 */
export const voteStartingStatusAtom: PrimitiveAtom<VoteStartingStatus | undefined> = atom<
  VoteStartingStatus | undefined
>();
