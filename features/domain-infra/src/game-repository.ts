import { child, Database, get, ref, update } from "firebase/database";
import * as resolver from "./game-ref-resolver.js";
import * as UserRefResolver from "./user-ref-resolver.js";
import { deserializeFrom } from "./game-snapshot-deserializer.js";
import { Game, User, GameRepository, Invitation } from "@spp/shared-domain";
import { filterUndefined } from "@spp/shared-basic";

const parseGameIdOrNull = function parseGameIdOrNull(_value: unknown): _value is Game.Id | null {
  return true;
};

const parseUserJoined = function parseUserJoined(_value: unknown): _value is Record<string, Game.T> {
  return _value != null;
};

/**
 * Implementation of `GameRepository.T`
 */
export class GameRepositoryImpl implements GameRepository.T {
  constructor(private database: Database) {}

  async save(game: Game.T): Promise<void> {
    const updates: { [key: string]: unknown } = {};
    updates[resolver.name(game.id)] = game.name;
    updates[resolver.cards(game.id)] = game.cards;
    updates[resolver.voting(game.id)] = game.voting;
    updates[resolver.owner(game.id)] = game.owner;
    updates[resolver.joinedPlayers(game.id)] = game.joinedPlayers.reduce<Record<string, unknown>>((accum, val) => {
      const { user, ...rest } = val;
      accum[user] = rest;

      return accum;
    }, {});

    const invitation = Game.makeInvitation(game);
    updates[`/invitations/${invitation}`] = game.id;

    await update(ref(this.database), updates);
  }

  async findByInvitation(signature: Invitation.T): Promise<Game.T | undefined> {
    if (signature === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "invitations"), signature));

    const gameId: unknown = snapshot.val();
    if (!parseGameIdOrNull(gameId) || !gameId) {
      return undefined;
    }

    return this.findBy(gameId);
  }

  async findBy(id: Game.Id): Promise<Game.T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "games"), id));

    const game = deserializeFrom(id, snapshot);

    return game ? game : undefined;
  }

  async listUserJoined(user: User.Id): Promise<Game.T[]> {
    const snapshot = await get(ref(this.database, UserRefResolver.joinedGames(user)));
    const val: unknown = snapshot.val();

    if (!parseUserJoined(val)) {
      return [];
    }

    const games = await Promise.all(
      Object.values(val).map(async (v) => {
        return this.findBy(v.id).then((game) => (game ? ([game, v] as const) : undefined));
      })
    );

    return games.filter(filterUndefined).map((v) => v[0]);
  }
}
