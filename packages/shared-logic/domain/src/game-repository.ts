import * as Game from "./game.js";
import * as User from "./user.js";

/**
 * Interface for GameRepository
 */
export interface T {
  /**
   * save game entity into repository
   */
  save(game: Game.T): Promise<void>;

  /**
   * Find game by id
   */
  findBy(id: Game.Id): Promise<Game.T | undefined>;

  /**
   * list games specified user created
   */
  listUserCreated(user: User.Id): Promise<Game.T[]>;

  /**
   * Delete a game by id.
   *
   * @param game the game to delete
   */
  delete(game: Game.T): Promise<void>;
}
