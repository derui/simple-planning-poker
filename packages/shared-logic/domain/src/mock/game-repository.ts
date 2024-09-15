import * as R from "../game-repository.js";
import * as Game from "../game.js";

/**
 * Make In-memory version `GameRepository.T` for testing purpose.
 */
export const newMemoryGameRepository = function newMemoryGameRepository(initial: Game.T[] = []): R.T {
  const data = new Map<Game.Id, Game.T>(initial.map((v) => [v.id, v]));

  return {
    save(voting: Game.T) {
      data.set(voting.id, voting);

      return Promise.resolve();
    },

    findBy(id: Game.Id) {
      return Promise.resolve(data.get(id));
    },

    findByInvitation(invitation) {
      return Promise.resolve(Array.from(data.values()).find((v) => Game.makeInvitation(v) == invitation));
    },
    listUserJoined(userId) {
      return Promise.resolve(Array.from(data.values()).filter((v) => v.joinedPlayers.map((v) => v.user == userId)));
    },
  };
};
