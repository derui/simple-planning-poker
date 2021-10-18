import { createStoryPoint } from "~/src/ts/domains/story-point";
import { UserId } from "~/src/ts/domains/user";
import { deserializeCard, serializeCard, SerializedCard } from "./card-converter";
import { createSelectableCards } from "~/src/ts/domains/selectable-cards";
import { child, Database, get, ref, update } from "firebase/database";
import { createGamePlayer, GamePlayer, GamePlayerId, UserMode } from "~/src/ts/domains/game-player";
import { GamePlayerRepository } from "~/src/ts/domains/game-player-repository";
import { GameId } from "~/src/ts/domains/game";

export class GamePlayerRepositoryImpl implements GamePlayerRepository {
  constructor(private database: Database) {}

  async findByUserAndGame(userId: UserId, gameId: GameId): Promise<GamePlayer | undefined> {
    const snapshot = await get(ref(this.database, `/users/${userId}/joinedGames/${gameId}`));

    const val: GamePlayerId | undefined = snapshot.val()?.playerId;
    if (!val) {
      return undefined;
    }

    return this.findBy(val);
  }

  async delete(player: GamePlayer) {
    const updates: { [key: string]: any } = {};

    updates[`/games/${player.game}users/${player.id}`] = null;
    updates[`/games/${player.game}/userHands/${player.id}`] = null;
    updates[`/gamePlayers/${player.id}`] = null;
    updates[`/users/${player.user}/joinedGames/${player.game}`] = null;

    await update(ref(this.database), updates);
  }

  async save(gamePlayer: GamePlayer): Promise<void> {
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

  async findBy(id: GamePlayerId): Promise<GamePlayer | undefined> {
    if (id === "") {
      return;
    }
    const snapshot = await get(child(ref(this.database, "gamePlayers"), id));

    const val = snapshot.val();
    if (!val) {
      return undefined;
    }
    const gameId = val["game"] as GameId;
    const userId = val["user"] as UserId;

    const gameSnapshot = await get(child(ref(this.database, "games"), gameId));

    const gameVal = gameSnapshot.val();
    if (!val) {
      return undefined;
    }
    const hands = gameVal.userHands as { [k: string]: SerializedCard | undefined } | undefined;
    const mode = gameVal.users[id] as UserMode;
    const hand: SerializedCard | undefined = hands ? hands[id] : undefined;
    const cards = gameVal["cards"] as number[];

    const selectableCards = createSelectableCards(cards.map(createStoryPoint));

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
