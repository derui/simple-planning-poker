import { filterUndefined } from "@spp/shared-basic";
import { Game } from "@spp/shared-domain";
import { type GameRepository as I } from "@spp/shared-domain/game-repository";
import { child, get, ref, set, update } from "firebase/database";
import { getDatabase } from "./database.js";
import * as resolver from "./game-ref-resolver.js";
import { deserializeFrom } from "./game-snapshot-deserializer.js";
import * as UserRefResolver from "./user-ref-resolver.js";

const parseUserJoined = function parseUserJoined(_value: unknown): _value is Record<string, { gameId: Game.Id }> {
  return !!_value;
};

/**
 * Implementation of `GameRepository.FindBy`
 */
const findBy: I.FindBy = async ({ id }) => {
  if (!id) {
    return;
  }
  const snapshot = await get(child(ref(getDatabase(), "games"), id));

  const game = deserializeFrom(id, snapshot);

  return game ? game : undefined;
};

/**
 * Implementation of `GameRepository.T`
 */
export const GameRepository: I = {
  save: async ({ game }) => {
    const updates: { [key: string]: unknown } = {};
    updates[resolver.name(game.id)] = game.name;
    updates[resolver.cards(game.id)] = game.points;
    updates[resolver.owner(game.id)] = game.owner;

    await update(ref(getDatabase()), updates);
  },

  findBy,

  listUserCreated: async ({ user }) => {
    const snapshot = await get(ref(getDatabase(), UserRefResolver.ownerGames(user)));
    const val: unknown = snapshot.val();

    if (!parseUserJoined(val)) {
      return [];
    }

    const games = await Promise.all(
      Object.values(val).map((v: { gameId: Game.Id }) => {
        return findBy({ id: v.gameId });
      })
    );

    return games.filter(filterUndefined);
  },

  delete: async ({ game }) => {
    await set(ref(getDatabase(), resolver.game(game.id)), null);
  },
};
