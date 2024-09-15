import { UseCase } from "./base.js";
import { GamePlayer, User, Game, GameRepository } from "@spp/shared-domain";

export interface ChangeUserModeInput {
  userId: User.Id;
  gameId: Game.Id;
  mode: GamePlayer.UserMode;
}

export type ChangeUserModeOutput = { kind: "success"; game: Game.T } | { kind: "notFound" };

export const newChangeUserModeUseCase = function newChangeUserModeUseCase(
  gameRepository: GameRepository.T
): UseCase<ChangeUserModeInput, ChangeUserModeOutput> {
  return async (input: ChangeUserModeInput): Promise<ChangeUserModeOutput> => {
    const game = await gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFound" };
    }

    const newGame = Game.declarePlayerAs(game, input.userId, input.mode);
    await gameRepository.save(newGame);

    return { kind: "success", game: newGame };
  };
};
