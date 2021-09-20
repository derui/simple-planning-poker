import { Game, GameId } from "./game";
import { InvitationSignature } from "./invitation";

export interface GameRepository {
  // save game entity into repository
  save(game: Game): Promise<void>;

  // find game by id
  findBy(id: GameId): Promise<Game | undefined>;

  // find game by invitation signature
  findByInvitationSignature(signature: InvitationSignature): Promise<Game | undefined>;
}
