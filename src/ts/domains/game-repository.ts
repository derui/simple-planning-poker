import { Game, GameId } from "./game";

export interface GameRepository {
  // save game entity into repository
  save(game: Game): void;

  // find game by id
  findBy(id: GameId): Game | undefined;
}
