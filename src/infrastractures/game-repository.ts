import { child, Database, get, ref, update } from "firebase/database";
import * as resolver from "./game-ref-resolver";
import * as UserRefResolver from "./user-ref-resolver";
import { deserializeFrom } from "./game-snapshot-deserializer";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import * as User from "@/domains/user";
import * as Invitation from "@/domains/invitation";

import { RoundRepository } from "@/domains/round-repository";

export class GameRepositoryImpl implements GameRepository {
  constructor(private database: Database, private roundRepository: RoundRepository) {}

  async save(game: Game.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    updates[resolver.name(game.id)] = game.name;
    updates[resolver.cards(game.id)] = game.cards;
    updates[resolver.round(game.id)] = game.round.id;
    updates[resolver.finishedRounds(game.id)] = game.finishedRounds;
    updates[resolver.owner(game.id)] = game.owner;
    updates[resolver.joinedPlayers(game.id)] = game.joinedPlayers.reduce<Record<any, any>>((accum, val) => {
      const { user, ...rest } = val;
      accum[user] = rest;

      return accum;
    }, {});

    const invitation = Game.makeInvitation(game);
    updates[`/invitations/${invitation}`] = game.id;

    await update(ref(this.database), updates);

    await this.roundRepository.save(game.round);
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

    const game = await deserializeFrom(id, snapshot, this.roundRepository);

    return game ? game : undefined;
  }

  async listUserJoined(user: User.Id): Promise<{ id: Game.Id; name: string }[]> {
    const snapshot = await get(ref(this.database, UserRefResolver.joinedGames(user)));
    const val = snapshot.val();

    if (!val) {
      return [];
    }

    const ret = Object.entries(val).map(([key, value]) => {
      return { id: Game.createId(key), name: (value as any).name as string };
    });

    return ret;
  }
}
