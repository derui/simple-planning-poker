import { child, Database, get, ref, update } from "firebase/database";
import * as resolver from "./game-ref-resolver";
import * as UserRefResolver from "./user-ref-resolver";
import { deserializeFrom } from "./game-snapshot-deserializer";
import * as Game from "@/domains/game";
import { GameRepository, JoinedGameState } from "@/domains/game-repository";
import * as User from "@/domains/user";
import * as Invitation from "@/domains/invitation";
import { filterUndefined } from "@/utils/basic";

export class GameRepositoryImpl implements GameRepository {
  constructor(private database: Database) {}

  async save(game: Game.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.name(game.id)] = game.name;
    updates[resolver.cards(game.id)] = game.cards;
    updates[resolver.round(game.id)] = game.round;
    updates[resolver.owner(game.id)] = game.owner;
    updates[resolver.joinedPlayers(game.id)] = game.joinedPlayers.reduce<Record<any, any>>((accum, val) => {
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

    const gameId = snapshot.val() as Game.Id | undefined;
    if (!gameId) {
      return undefined;
    }

    return this.findBy(gameId);
  }

  async findBy(id: Game.Id): Promise<Game.T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "games"), id));

    const game = await deserializeFrom(id, snapshot);

    return game ? game : undefined;
  }

  async listUserJoined(user: User.Id): Promise<{ id: Game.Id; name: string; state: JoinedGameState }[]> {
    const snapshot = await get(ref(this.database, UserRefResolver.joinedGames(user)));
    const val = snapshot.val();

    if (!val) {
      return [];
    }

    const games = await Promise.all(
      Object.values(val as Record<string, { gameId: Game.Id; state: JoinedGameState }>).map(async (v) => {
        return this.findBy(v.gameId).then((game) => (game ? ([game, v] as const) : undefined));
      })
    );

    return games.filter(filterUndefined).map(([game, v]) => ({ id: game.id, name: game.name, state: v.state }));
  }
}
