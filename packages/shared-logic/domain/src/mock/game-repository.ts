import { type GameRepository as I } from "../game-repository.js";
import * as Game from "../game.js";

/**
 * In-memory version `GameRepository.T` for testing purpose.
 */
const data = new Map<Game.Id, Game.T>();
/**
 * Clear test data
 */
export const clear = (): void => {
  data.clear();
};

/**
 * Make In-memory version `GameRepository.T` for testing purpose.
 */
export const GameRepository: I = {
  save: ({ game }) => {
    data.set(game.id, game);

    return Promise.resolve();
  },

  findBy: ({ id }) => {
    return Promise.resolve(data.get(id));
  },

  listUserCreated: ({ user }) => {
    return Promise.resolve(Array.from(data.values()).filter((v) => v.owner == user));
  },

  delete: ({ game }) => {
    data.delete(game.id);
    return Promise.resolve();
  },
};
