import { EventFactory, UserInvited } from "./event";
import { GameId } from "./game";
import { createGamePlayer, createGamePlayerId } from "./game-player";
import { GamePlayerRepository } from "./game-player-repository";
import { GameRepository } from "./game-repository";
import { InvitationSignature } from "./invitation";
import { User } from "./user";

export interface JoinService {
  join(user: User, gameId: GameId): Promise<UserInvited | undefined>;
}

export const createJoinService = (
  gameRepository: GameRepository,
  gamePlayerRepository: GamePlayerRepository
): JoinService => {
  return {
    async join(user: User, signature: InvitationSignature): Promise<UserInvited | undefined> {
      const game = await gameRepository.findByInvitationSignature(signature);

      if (!game) {
        return undefined;
      }

      const player = createGamePlayer({
        id: createGamePlayerId(),
        userId: user.id,
        gameId: game.id,
        cards: game.cards,
      });

      gamePlayerRepository.save(player);

      return EventFactory.userInvited(player.id, game.id, user.id);
    },
  };
};
