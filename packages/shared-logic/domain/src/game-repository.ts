import * as Game from "./game";
import * as User from "./user";
import * as Invitation from "./invitation";

/**
 * state of joined game.
 */
export enum JoinedGameState {
  joined,
  left,
}

export interface T {
  // save game entity into repository
  save(game: Game.T): Promise<void>;

  // find game by id
  findBy(id: Game.Id): Promise<Game.T | undefined>;

  // find game by invitation signature
  findByInvitation(signature: Invitation.T): Promise<Game.T | undefined>;

  /**
   * list games specified user joined
   */
  listUserJoined(user: User.Id): Promise<Game.T[]>;
}
