import { ApplicablePoints, Game, GameName } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { dispatch } from "@spp/shared-use-case";
import { Atom, atom, WritableAtom } from "jotai";
import { atomWithRefresh, loadable } from "jotai/utils";
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
export const deleteCurrentGameAtom: WritableAtom<null, [], Promise<void>> = atom(null, async (get, set) => {
  const game = await get(asyncCurrentGameAtom);
  const progress = get(internalCommandProgressionAtom);
  const user = get(loginUserAtom);
  if (!game || progress) {
    return;
  }

  if (!user || game.owner != user.id) {
    return;
  }

  set(internalCommandProgressionAtom, true);

  try {
    await GameRepository.delete({ game });
    set(selectedGameIdAtom, undefined);
    set(asyncGamesAtom);
  } catch (e) {
    console.warn(e);
  } finally {
    set(internalCommandProgressionAtom, false);
  }
});

/**
 * All games that user is holding
 */
const asyncGamesAtom = atomWithRefresh(async (get) => {
  const user = get(loginUserAtom);

  if (!user) return [];

  return await GameRepository.listUserCreated({ user: user.id });
});

/**
 * All games that user is holding
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
export const createGameAtom: WritableAtom<
  null,
  [obj: { name: string; points: string }, callback?: () => void],
  Promise<void>
> = atom(null, async (get, set, obj, callback) => {
    const loginUser = get(loginUserAtom);
    const loading = get(internalCommandProgressionAtom);
    if (!loginUser || loading) {
      return;
    }

    set(internalCommandProgressionAtom, true);
    set(internalGameCreationErrorAtom, []);

    if (!GameName.isValid(obj.name)) {
      set(internalGameCreationErrorAtom, ["InvalidName"]);
      set(internalCommandProgressionAtom, false);
      return;
    }

    const points = ApplicablePoints.parse(obj.points);
    if (!points) {
      set(internalGameCreationErrorAtom, ["InvalidPoints"]);
      set(internalCommandProgressionAtom, false);
      return;
    }

    const gameId = Game.createId();
    const [game, event] = Game.create({
      id: gameId,
      name: GameName.create(obj.name),
      owner: loginUser.id,
      points: points,
    });

    try {
      await GameRepository.save({ game });
      dispatch(event);
      set(asyncGamesAtom);
      callback?.();
    } catch (e) {
      console.warn(e);
    } finally {
      set(internalCommandProgressionAtom, false);
    }
  });

const internalGameEditingErrorAtom = atom<EditGameError[]>([]);

/**
 * Game edit errors. This atom is read-only.
 */
export const gameEditingErrorAtom: Atom<EditGameError[]> = atom((get) => get(internalGameEditingErrorAtom));

/**
 * Try to create a game. If error occurs, the error will be stored in the error atom.
 */
export const editGameAtom: WritableAtom<null, [obj: { name: string; points: string }], Promise<void>> = atom(
  null,
  async (get, set, obj) => {
    const game = await get(asyncCurrentGameAtom);
    const loading = get(internalCommandProgressionAtom);
    if (!game || loading) {
      return;
    }

    set(internalCommandProgressionAtom, true);
    set(internalGameEditingErrorAtom, []);

    if (!GameName.isValid(obj.name)) {
      set(internalGameEditingErrorAtom, ["InvalidName"]);
      set(internalCommandProgressionAtom, false);
      return;
    }

    const points = ApplicablePoints.parse(obj.points);
    if (!points) {
      set(internalGameEditingErrorAtom, ["InvalidPoints"]);
      set(internalCommandProgressionAtom, false);
      return;
    }

    try {
      let newOne = Game.changeName(game, obj.name);
      newOne = Game.changePoints(newOne, points);
      await GameRepository.save({ game: newOne });
      set(asyncGamesAtom);
      set(asyncCurrentGameAtom);
    } catch (e) {
      console.warn(e);
    } finally {
      set(internalCommandProgressionAtom, false);
    }
  }
);

/**
 * Atom to start a voting for the current game.
 * @param callback - A function that will be called with the `votingId` after saving the voting.
 */
export const startVotingAtom: WritableAtom<null, [(votingId: string) => void], Promise<void>> = atom(
  null,
  async (get, _set, callback) => {
    const game = await get(asyncCurrentGameAtom);
    if (!game) return;

    // Call Game.newVoting if the game is valid and store the returned values
    const [voting, event] = Game.newVoting(game);

    // Save the voting to the repository
    try {
      await VotingRepository.save({ voting });
      dispatch(event);
      callback(voting.id);
    } catch (e) {
      console.warn(e);
    }
  }
);
