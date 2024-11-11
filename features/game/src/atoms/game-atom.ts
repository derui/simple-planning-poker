import { Game } from "@spp/shared-domain";
import { atom, PrimitiveAtom } from "jotai";
import { CreateGameStatus, VoteStartingStatus } from "./type.js";

/**
 * enum for game status management
 */
export enum GameStatus {
  Create = "create",
  Creating = "creating",
  Edit = "edit",
  Editing = "editing",
  Deleting = "deleting",
  Detail = "detail",
}

/**
 * Atom to store game status
 */
export const gameStatusAtom: PrimitiveAtom<GameStatus> = atom<GameStatus>(GameStatus.Detail);

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

/**
 * A validation errors
 */
export type CreateGameValidation = "InvalidName" | "InvalidPoints" | "NameConflicted";

/**
 * An atom to store validation
 */
export const createGameValidationsAtom: PrimitiveAtom<CreateGameValidation[]> = atom<CreateGameValidation[]>([]);

export const createGameStatusAtom: PrimitiveAtom<CreateGameStatus | undefined> = atom<CreateGameStatus | undefined>();

/**
 * An atom to store selected game
 */
export const selectedGameAtom: PrimitiveAtom<Game.T | undefined> = atom<Game.T | undefined>(undefined);
