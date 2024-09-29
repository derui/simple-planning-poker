import * as Game from "./game";
import * as User from "./user";
import { T } from "./invitation";

export const JoinedGameState = {
  joined: "joined",
  left: "left",
} as const;

/**
 * state of joined game.
 */
export type JoinedGameState = (typeof JoinedGameState)[keyof typeof JoinedGameState];

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
  listUserJoined(user: User.Id): Promise<{ id: Game.Id; name: string; state: JoinedGameState }[]>;
}
