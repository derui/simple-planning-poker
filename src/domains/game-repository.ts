import * as Game from "./game";
import { InvitationSignature } from "./invitation";

export interface GameRepository {
  // save game entity into repository
  save(game: Game.Game): Promise<void>;

  // find game by id
  findBy(id: Game.GameId): Promise<Game.Game | undefined>;

  // find game by invitation signature
  findByInvitationSignature(signature: InvitationSignature): Promise<Game.Game | undefined>;
}
