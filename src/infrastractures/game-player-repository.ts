import { create } from "@/domains/story-point";
import { Id } from "@/domains/user";
import { deserializeCard, serializeCard, SerializedCard } from "./card-converter";
import { create } from "@/domains/selectable-cards";
import { child, Database, get, ref, update } from "firebase/database";
import { createGamePlayer, T, Id, UserMode } from "@/domains/game-player";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { GameId } from "@/domains/game";

export class GamePlayerRepositoryImpl implements GamePlayerRepository {
  constructor(private database: Database) {}

  async findByUserAndGame(userId: Id, gameId: GameId): Promise<T | undefined> {
    const snapshot = await get(ref(this.database, `/users/${userId}/joinedGames/${gameId}`));

    const val: Id | undefined = snapshot.val()?.playerId;
    if (!val) {
      return undefined;
    }

    return this.findBy(val);
  }

  async delete(player: T) {
    const updates: { [key: string]: any } = {};

    updates[`/games/${player.game}/users/${player.id}`] = null;
    updates[`/games/${player.game}/userHands/${player.id}`] = null;
    updates[`/gamePlayers/${player.id}`] = null;
    updates[`/users/${player.user}/joinedGames/${player.game}`] = null;

    await update(ref(this.database), updates);
  }

  async save(gamePlayer: T): Promise<void> {
    const updates: { [key: string]: any } = {};
    const hand = gamePlayer.hand;

    updates[`/games/${gamePlayer.game}/users/${gamePlayer.id}`] = gamePlayer.mode;
    if (hand) {
      updates[`/games/${gamePlayer.game}/userHands/${gamePlayer.id}`] = serializeCard(hand);
    }
    updates[`/gamePlayers/${gamePlayer.id}`] = { user: gamePlayer.user, game: gamePlayer.game };
    updates[`/users/${gamePlayer.user}/joinedGames/${gamePlayer.game}`] = {
      playerId: gamePlayer.id,
    };

    await update(ref(this.database), updates);
  }

  async findBy(id: Id): Promise<T | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "gamePlayers"), id));

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }
    const gameId = val["game"] as GameId;
    const userId = val["user"] as Id;

    const gameSnapshot = await get(child(ref(this.database, "games"), gameId));

    const gameVal = gameSnapshot.val();
    if (!val) {
      return undefined;
    }
    const hands = gameVal.userHands as { [k: string]: SerializedCard | undefined } | undefined;
    const mode = gameVal.users[id] as UserMode;
    const hand: SerializedCard | undefined = hands ? hands[id] : undefined;
    const cards = gameVal["cards"] as number[];

    const selectableCards = create(cards.map(create));

    return createGamePlayer({
      id,
      userId,
      gameId,
      mode,
      hand: hand ? deserializeCard(hand) : undefined,
      cards: selectableCards,
    });
  }
}
