import * as User from "@/domains/user";
import { deserialize, serialize, Serialized } from "./user-hand-converter";
import { child, Database, get, ref, update } from "firebase/database";
import * as GamePlayer from "@/domains/game-player";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import * as Game from "@/domains/game";

export class GamePlayerRepositoryImpl implements GamePlayerRepository {
  constructor(private database: Database) {}

  async findByUserAndGame(userId: User.Id, gameId: Game.GameId): Promise<GamePlayer.T | undefined> {
    const snapshot = await get(ref(this.database, `/users/${userId}/joinedGames/${gameId}`));

    const val: GamePlayer.Id | undefined = snapshot.val()?.playerId;
    if (!val) {
      return undefined;
    }

    return this.findBy(val);
  }

  async delete(player: GamePlayer.T) {
    const updates: { [key: string]: any } = {};

    updates[`/games/${player.game}/users/${player.id}`] = null;
    updates[`/games/${player.game}/userHands/${player.id}`] = null;
    updates[`/gamePlayers/${player.id}`] = null;
    updates[`/users/${player.user}/joinedGames/${player.game}`] = null;

    await update(ref(this.database), updates);
  }

  async save(gamePlayer: GamePlayer.T): Promise<void> {
    const updates: { [key: string]: any } = {};
    const hand = gamePlayer.hand;

    updates[`/games/${gamePlayer.game}/users/${gamePlayer.id}`] = gamePlayer.mode;
    if (hand) {
      updates[`/games/${gamePlayer.game}/userHands/${gamePlayer.id}`] = serialize(hand);
    }
    updates[`/gamePlayers/${gamePlayer.id}`] = { user: gamePlayer.user, game: gamePlayer.game };
    updates[`/users/${gamePlayer.user}/joinedGames/${gamePlayer.game}`] = {
      playerId: gamePlayer.id,
    };

    await update(ref(this.database), updates);
  }

  async findBy(id: GamePlayer.Id): Promise<GamePlayer.T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "gamePlayers"), id));

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }
    const gameId = val["game"] as Game.GameId;
    const userId = val["user"] as User.Id;

    const gameSnapshot = await get(child(ref(this.database, "games"), gameId));

    const gameVal = gameSnapshot.val();
    if (!val) {
      return undefined;
    }
    const hands = gameVal.userHands as { [k: string]: Serialized | undefined } | undefined;
    const mode = gameVal.users[id] as GamePlayer.UserMode;
    const hand: Serialized | undefined = hands ? hands[id] : undefined;

    return GamePlayer.createGamePlayer({
      id,
      userId,
      gameId,
      mode,
      hand: hand ? deserialize(hand) : undefined,
    });
  }
}
