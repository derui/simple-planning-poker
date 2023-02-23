import * as Game from "./game";
import { InvitationSignature } from "./invitation";

export interface GameRepository {
  // save game entity into repository
  save(game: Game.T): Promise<void>;

  // find game by id
  findBy(id: Game.Id): Promise<Game.T | undefined>;

  // find game by invitation signature
  findByInvitationSignature(signature: InvitationSignature): Promise<Game.T | undefined>;
}
