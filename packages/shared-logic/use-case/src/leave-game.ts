import { EventDispatcher, UseCase } from "./base.js";
import { Game, GameRepository, User } from "@spp/shared-domain";

export interface LeaveGameUseCaseInput {
  gameId: Game.Id;
  userId: User.Id;
}

export type LeaveGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFound" }
  | { kind: "ownerCanNotLeave" };

/**
 * Get new instance of use case to leave a user from the game
 */
export const newLeaveGameUseCase = function newLeaveGameUseCase(
  gameRepository: GameRepository.T,
  dispatcher: EventDispatcher
): UseCase<LeaveGameUseCaseInput, LeaveGameUseCaseOutput> {
  return async (input) => {
    const game = await gameRepository.findBy(input.gameId);

    if (!game) {
      return { kind: "notFound" };
    }
    const [newGame, event] = Game.acceptLeaveFrom(game, input.userId);

    if (!event) {
      return { kind: "ownerCanNotLeave" };
    }

    await gameRepository.save(newGame);
    dispatcher(event);

    return { kind: "success", game: newGame };
  };
};
