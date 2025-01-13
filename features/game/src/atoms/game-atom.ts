import { ApplicablePoints, Game, GameName } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { dispatch } from "@spp/shared-use-case";
import { Atom, atom, WritableAtom } from "jotai";
import { atomWithRefresh, loadable, unwrap } from "jotai/utils";
import { Loadable } from "jotai/vanilla/utils/loadable";
import { CreateGameError, EditGameError } from "./type.js";
import { loginUserAtom } from "./user-atom.js";

const selectedGameIdAtom = atom<Game.Id | undefined>(undefined);

const asyncCurrentGameAtom = atomWithRefresh(async (get) => {
  const id = get(selectedGameIdAtom);
  const user = get(loginUserAtom);

  if (!id || !user) return undefined;

  const game = await GameRepository.findBy({ id });

  if (game?.owner != user.id) {
    return;
  }

  return game;
});

/**
 * The current game atom.
 */
export const currentGameAtom: Atom<Loadable<Game.T | undefined>> = loadable(asyncCurrentGameAtom);
export const loadGameAtom: WritableAtom<null, [gameId: Game.Id], void> = atom(null, (_get, set, gameId: Game.Id) => {
  set(selectedGameIdAtom, gameId);
});

const internalCommandProgressionAtom = atom(false);

/**
 * Loading state of the current game.
 */
export const commandProgressionAtom: Atom<boolean> = atom((get) => get(internalCommandProgressionAtom));

/**
 * Delete current game. After deleting, the current game atom will be set to undefined.
 */
export const deleteCurrentGameAtom: WritableAtom<null, [], void> = atom(null, (get, set) => {
  const game = get(unwrap(asyncCurrentGameAtom));
  const progress = get(internalCommandProgressionAtom);
  const user = get(loginUserAtom);
  if (!game || progress) {
    return;
  }

  if (!user || game.owner != user.id) {
    return;
  }

  set(internalCommandProgressionAtom, true);

  GameRepository.delete({ game })
    .then(() => {
      set(selectedGameIdAtom, undefined);
      set(asyncGamesAtom);
    })
    .catch((e) => {
      console.warn(e);
    })
    .finally(() => {
      set(internalCommandProgressionAtom, false);
    });
});

/**
 * All games that user is helding
 */
const asyncGamesAtom = atomWithRefresh(async (get) => {
  const user = get(loginUserAtom);

  if (!user) return [];

  return await GameRepository.listUserCreated({ user: user.id });
});

/**
 * All games that user is helding
 */
export const gamesAtom: Atom<Loadable<Game.T[]>> = loadable(asyncGamesAtom);

const internalGameCreationErrorAtom = atom<CreateGameError[]>([]);

/**
 * Game creation errors. This atom is read-only.
 */
export const gameCreationErrorAtom: Atom<CreateGameError[]> = atom((get) => get(internalGameCreationErrorAtom));

/**
 * Try to create a game. If error occurs, the error will be stored in the error atom.
 */
export const createGameAtom: WritableAtom<null, [obj: { name: string; points: string }, callback: () => void], void> =
  atom(null, (get, set, obj, callback) => {
    const loginUser = get(loginUserAtom);
    const loading = get(internalCommandProgressionAtom);
    if (!loginUser || loading) {
      return;
    }

    set(internalCommandProgressionAtom, true);
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
      owner: loginUser.id,
      points: points,
    });

    GameRepository.save({ game })
      .then(() => {
        dispatch(event);
        set(asyncGamesAtom);
        callback();
      })
      .catch((e) => {
        console.warn(e);
      })
      .finally(() => {
        set(internalCommandProgressionAtom, false);
      });
  });

const internalGameEditingErrorAtom = atom<EditGameError[]>([]);

/**
 * Game edit errors. This atom is read-only.
 */
export const gameEditingErrorAtom: Atom<EditGameError[]> = atom((get) => get(internalGameEditingErrorAtom));

/**
 * Try to create a game. If error occurs, the error will be stored in the error atom.
 */
export const editGameAtom: WritableAtom<null, [obj: { name: string; points: string }], void> = atom(
  null,
  (get, set, obj) => {
    const game = get(unwrap(asyncCurrentGameAtom));
    const loading = get(internalCommandProgressionAtom);
    if (!game || loading) {
      return;
    }

    set(internalCommandProgressionAtom, true);
    set(internalGameEditingErrorAtom, []);

    if (!GameName.isValid(obj.name)) {
      set(internalGameEditingErrorAtom, ["InvalidName"]);
      return;
    }

    const points = ApplicablePoints.parse(obj.points);
    if (!points) {
      set(internalGameEditingErrorAtom, ["InvalidPoints"]);
      return;
    }

    Promise.resolve(game)
      .then((game) => {
        let newOne = Game.changeName(game, obj.name);
        newOne = Game.changePoints(newOne, points);
        return newOne;
      })
      .then((game) => GameRepository.save({ game }))
      .then(() => {
        set(asyncGamesAtom);
        set(asyncCurrentGameAtom);
      })
      .catch((e) => {
        console.warn(e);
      })
      .finally(() => {
        set(internalCommandProgressionAtom, false);
      });
  }
);
