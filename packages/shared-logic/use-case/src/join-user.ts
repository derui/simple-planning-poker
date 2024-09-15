import { EventDispatcher, UseCase } from "./base.js";
import { GameRepository, Invitation, User, Game, UserRepository } from "@spp/shared-domain";

export interface JoinUserUseCaseInput {
  signature: Invitation.T;
  userId: User.Id;
}

export type JoinUserUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFoundUser" }
  | { kind: "notFoundGame" }
  | { kind: "joinFailed" };

/**
 * Create new instance of use case to join user to the game
 */
export const newJoinUserUseCase = function newJoinUserUseCase(
  dispatcher: EventDispatcher,
  userRepository: UserRepository.T,
  gameRepository: GameRepository.T
): UseCase<JoinUserUseCaseInput, JoinUserUseCaseOutput> {
  return async (input: JoinUserUseCaseInput): Promise<JoinUserUseCaseOutput> => {
    const user = await userRepository.findBy(input.userId);

    if (!user) {
      return { kind: "notFoundUser" };
    }
    const game = await gameRepository.findByInvitation(input.signature);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    try {
      const [newGame, event] = Game.joinUserAsPlayer(game, user.id, input.signature);
      await gameRepository.save(newGame);

      dispatcher(event);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "joinFailed" };
    }
  };
};
