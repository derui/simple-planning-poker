import { GameId } from "./game";
import { GamePlayer, GamePlayerId } from "./game-player";
import { UserId } from "./user";

export interface GamePlayerRepository {
  // save game entity into repository
  save(gamePlayer: GamePlayer): Promise<void>;

  // find game by id
  findBy(id: GamePlayerId): Promise<GamePlayer | undefined>;

  // find player from user id and game
  findByUserAndGame(userId: UserId, gameId: GameId): Promise<GamePlayer | undefined>;
}
