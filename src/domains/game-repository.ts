import * as Game from "./game";
import * as User from "./user";
import { T } from "./invitation";

export interface GameRepository {
  // save game entity into repository
  save(game: Game.T): Promise<void>;

  // find game by id
  findBy(id: Game.Id): Promise<Game.T | undefined>;

  // find game by invitation signature
  findByInvitation(signature: T): Promise<Game.T | undefined>;

  /**
   * list games specified user joined
   */
  listUserJoined(user: User.Id): Promise<{ id: Game.Id; name: string }[]>;
}
