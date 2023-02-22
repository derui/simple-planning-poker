import { GameId } from "./game";
import { T, Id } from "./game-player";
import { Id } from "./user";

export interface GamePlayerRepository {
  // save game entity into repository
  save(gamePlayer: T): Promise<void>;

  // find game by id
  findBy(id: Id): Promise<T | undefined>;

  // find player from user id and game
  findByUserAndGame(userId: Id, gameId: GameId): Promise<T | undefined>;

  // delete a player
  delete(player: T): Promise<void>;
}
