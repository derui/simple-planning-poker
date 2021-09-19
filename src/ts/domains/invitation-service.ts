import { EventFactory, UserInvited } from "./event";
import { GameId } from "./game";
import { createGamePlayer, createGamePlayerId } from "./game-player";
import { GamePlayerRepository } from "./game-player-repository";
import { GameRepository } from "./game-repository";
import { User } from "./user";

export interface InvitationService {
  invite(user: User, gameId: GameId): Promise<UserInvited | undefined>;
}

export const createInvitationService = (
  gameRepository: GameRepository,
  gamePlayerRepository: GamePlayerRepository
): InvitationService => {
  return {
    async invite(user: User, gameId: GameId): Promise<UserInvited | undefined> {
      const game = await gameRepository.findBy(gameId);

      if (!game) {
        return undefined;
      }

      const player = createGamePlayer({
        id: createGamePlayerId(),
        userId: user.id,
        gameId,
        cards: game.cards,
      });

      gamePlayerRepository.save(player);

      return EventFactory.userInvited(player.id, gameId, user.id);
    },
  };
};
