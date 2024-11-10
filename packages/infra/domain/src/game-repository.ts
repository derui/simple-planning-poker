import { filterUndefined } from "@spp/shared-basic";
import { Game, GameRepository, User } from "@spp/shared-domain";
import { child, Database, get, ref, set, update } from "firebase/database";
import * as resolver from "./game-ref-resolver.js";
import { deserializeFrom } from "./game-snapshot-deserializer.js";
import * as UserRefResolver from "./user-ref-resolver.js";

const parseUserJoined = function parseUserJoined(_value: unknown): _value is Record<string, { gameId: Game.Id }> {
  return !!_value;
};

/**
 * Implementation of `GameRepository.T`
 */
export class GameRepositoryImpl implements GameRepository.T {
  constructor(private database: Database) {}

  async save(game: Game.T): Promise<void> {
    const updates: { [key: string]: unknown } = {};
    updates[resolver.name(game.id)] = game.name;
    updates[resolver.cards(game.id)] = game.points;
    updates[resolver.owner(game.id)] = game.owner;

    await update(ref(this.database), updates);
  }

  async findBy(id: Game.Id): Promise<Game.T | undefined> {
    if (!id) {
      return;
    }
    const snapshot = await get(child(ref(this.database, "games"), id));

    const game = deserializeFrom(id, snapshot);

    return game ? game : undefined;
  }

  async listUserCreated(user: User.Id): Promise<Game.T[]> {
    const snapshot = await get(ref(this.database, UserRefResolver.ownerGames(user)));
    const val: unknown = snapshot.val();

    if (!parseUserJoined(val)) {
      return [];
    }

    const games = await Promise.all(
      Object.values(val).map((v: { gameId: Game.Id }) => {
        return this.findBy(v.gameId);
      })
    );

    return games.filter(filterUndefined);
  }

  async delete(game: Game.T): Promise<void> {
    await set(ref(this.database, resolver.game(game.id)), null);
  }
}
