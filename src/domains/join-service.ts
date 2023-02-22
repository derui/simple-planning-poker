import { UserInvited } from "./event";
import * as EventFactory from "./event-factory";
import * as GamePlayer from "./game-player";
import { GamePlayerRepository } from "./game-player-repository";
import { GameRepository } from "./game-repository";
import * as Invitation from "./invitation";
import * as User from "./user";

export interface JoinService {
  join(user: User.T, signature: Invitation.InvitationSignature): Promise<UserInvited | undefined>;
}

export const create = (gameRepository: GameRepository, gamePlayerRepository: GamePlayerRepository): JoinService => {
  return {
    async join(user: User.T, signature: Invitation.InvitationSignature): Promise<UserInvited | undefined> {
      const game = await gameRepository.findByInvitationSignature(signature);

      if (!game) {
        return undefined;
      }

      const joinedGame = User.findJoinedGame(user, game.id);
      if (joinedGame) {
        return EventFactory.userInvited(joinedGame.playerId, joinedGame.gameId, user.id);
      }

      const player = GamePlayer.createGamePlayer({
        id: GamePlayer.createId(),
        userId: user.id,
        gameId: game.id,
      });

      await gamePlayerRepository.save(player);

      return EventFactory.userInvited(player.id, game.id, user.id);
    },
  };
};
