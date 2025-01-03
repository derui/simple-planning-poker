import { ApplicablePoints, Game, GameName, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { dispatch } from "@spp/shared-use-case";
import { Atom, atom, WritableAtom } from "jotai";
import { atomWithRefresh, loadable } from "jotai/utils";
import { Loadable } from "jotai/vanilla/utils/loadable";
import { CreateGameError } from "./type.js";

const selectedGameIdAtom = atom<Game.Id | undefined>(undefined);

const asyncCurrentGameAtom = atomWithRefresh(async (get) => {
  const id = get(selectedGameIdAtom);

  if (!id) return undefined;

  return await GameRepository.findBy({ id });
});

/**
 * The current game atom.
 */
export const currentGameAtom: Atom<Loadable<Game.T | undefined>> = loadable(asyncCurrentGameAtom);
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
const asyncGamesAtom = atomWithRefresh(async (get) => {
  const userId = get(loginUserIdAtom);

  if (!userId) return [];

  return await GameRepository.listUserCreated({ user: userId });
});

/**
 * All games that user is helding
 */
export const gamesAtom: Atom<Loadable<Game.T[]>> = loadable(asyncGamesAtom);

/**
 * Load games with the user
 */
export const loadGamesAtom: WritableAtom<null, [userId: User.Id], void> = atom(null, (_get, set, userId: User.Id) => {
  set(loginUserIdAtom, userId);
});

const internalGameCreatingAtom = atom(false);

/**
 * Is game creating. This atom is read-only.
 */
export const gameCreatingAtom: Atom<boolean> = atom((get) => get(internalGameCreatingAtom));

const internalGameCreationErrorAtom = atom<CreateGameError[]>([]);

/**
 * Game creation errors. This atom is read-only.
 */
export const gameCreationErrorAtom: Atom<CreateGameError[]> = atom((get) => get(internalGameCreationErrorAtom));

/**
 * Try to create a game. If error occurs, the error will be stored in the error atom.
 */
export const createGameAtom: WritableAtom<null, [obj: { name: string; points: string }], void> = atom(
  null,
  (get, set, obj) => {
    const loginUserId = get(loginUserIdAtom);
    const loading = get(internalGameCreatingAtom);
    if (!loginUserId || loading) {
      return;
    }

    set(internalGameCreatingAtom, true);
    set(internalGameCreationErrorAtom, []);

    if (!GameName.isValid(obj.name)) {
      set(internalGameCreationErrorAtom, ["InvalidName"]);
      return;
    }

    const points = ApplicablePoints.parse(obj.points);
    if (!points) {
      set(internalGameCreationErrorAtom, ["InvalidPoints"]);
      return;
    }

    const gameId = Game.createId();
    const [game, event] = Game.create({
      id: gameId,
      name: GameName.create(obj.name),
      owner: loginUserId,
      points: points,
    });

    GameRepository.save({ game })
      .then(() => {
        dispatch(event);
        set(asyncGamesAtom);
      })
      .catch((e) => {
        console.warn(e);
      })
      .finally(() => {
        set(internalGameCreatingAtom, false);
      });
  }
);
