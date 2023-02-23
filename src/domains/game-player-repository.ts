import * as Game from "./game";
import * as GamePlayer from "./game-player";
import * as User from "./user";

export interface GamePlayerRepository {
  // save game entity into repository
  save(gamePlayer: GamePlayer.T): Promise<void>;

  // find game by id
  findBy(id: GamePlayer.Id): Promise<GamePlayer.T | undefined>;

  // find player from user id and game
  findByUserAndGame(userId: User.Id, gameId: Game.GameId): Promise<GamePlayer.T | undefined>;

  // delete a player
  delete(player: GamePlayer.T): Promise<void>;
}
