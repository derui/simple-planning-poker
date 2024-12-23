import { Game, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { Atom, atom, WritableAtom } from "jotai";
import { loadable } from "jotai/utils";
import { Loadable } from "jotai/vanilla/utils/loadable";

const selectedGameIdAtom = atom<Game.Id | undefined>(undefined);

const asyncCurrentGameAtom = atom(async (get) => {
  const id = get(selectedGameIdAtom);

  if (!id) return undefined;

  return await GameRepository.findBy({ id });
});

/**
 * The current game atom.
 */
export const currentGameAtom: Atom<Loadable<Promise<Game.T | undefined>>> = loadable(asyncCurrentGameAtom);
export const loadGameAtom: WritableAtom<null, [gameId: Game.Id], void> = atom(null, (_get, set, gameId: Game.Id) => {
  set(selectedGameIdAtom, gameId);
});

/**
 * Reset the current game to unselected.
 */
export const resetGameAtom: WritableAtom<null, [], void> = atom(null, (_get, set) => {
  set(selectedGameIdAtom, undefined);
});

/**
 * All games that user is helding
 */
const loginUserIdAtom = atom<User.Id | undefined>();
const asyncGamesAtom = atom(async (get) => {
  const userId = get(loginUserIdAtom);

  if (!userId) return [];

  return await GameRepository.listUserCreated({ user: userId });
});

/**
 * All games that user is helding
 */
export const gamesAtom: Atom<Loadable<Promise<Game.T[]>>> = loadable(asyncGamesAtom);

/**
 * Load games with the user
 */
export const loadGamesAtom: WritableAtom<null, [userId: User.Id], void> = atom(null, (_get, set, userId: User.Id) => {
  set(loginUserIdAtom, userId);
});
