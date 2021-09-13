import { GamePlayer, GamePlayerId } from "./game-player";

export interface GamePlayerRepository {
  // save game entity into repository
  save(gamePlayer: GamePlayer): void;

  // find game by id
  findBy(id: GamePlayerId): Promise<GamePlayer | undefined>;
}
