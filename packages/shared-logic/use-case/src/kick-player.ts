import { EventDispatcher, UseCase } from "./base.js";
import { Game, User, GameRepository } from "@spp/shared-domain";

export interface KickPlayerUserCaseInput {
  gameId: Game.Id;
  requestedUserId: User.Id;
  targetUserId: User.Id;
}

export type KickPlayerUseCaseOutput =
  | {
      kind: "success";
      game: Game.T;
    }
  | { kind: "notFoundGame" }
  | { kind: "canNotKickByPlayer" }
  | { kind: "kickFailed" };

/**
 * Get new instance of use case to kick a player from the game
 */
export const newKickPlayerUseCase = function newKickPlayerUseCase(
  dispatcher: EventDispatcher,
  gameRepository: GameRepository.T
): UseCase<KickPlayerUserCaseInput, KickPlayerUseCaseOutput> {
  return async (input) => {
    const game = await gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    if (input.requestedUserId !== game.owner) {
      return { kind: "canNotKickByPlayer" };
    }

    try {
      const [newGame, event] = Game.acceptLeaveFrom(game, input.targetUserId);
      if (!event) {
        return { kind: "kickFailed" };
      }

      await gameRepository.save(newGame);

      dispatcher(event);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);
      return { kind: "kickFailed" };
    }
  };
};
