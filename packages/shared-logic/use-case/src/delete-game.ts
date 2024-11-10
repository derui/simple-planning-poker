import { Game, GameRepository, User } from "@spp/shared-domain";
import { Prettify } from "@spp/shared-type-util";
import { UseCase } from "./base.js";

export interface DeleteGameUseCaseInput {
  gameId: Game.Id;
  ownedBy: User.Id;
}

export type DeleteGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFound" }
  | { kind: "doNotOwned" }
  | { kind: "failed" };

export type DeleteGameUseCase = UseCase<DeleteGameUseCaseInput, DeleteGameUseCaseOutput>;

export const newDeleteGameUseCase = function newDeleteGameUseCase(
  gameRepository: Prettify<GameRepository.T>
): DeleteGameUseCase {
  return async (input) => {
    const target = await gameRepository.findBy(input.gameId);
    if (!target) {
      return { kind: "notFound" };
    }

    if (target.owner != input.ownedBy) {
      return { kind: "doNotOwned" };
    }

    try {
      await gameRepository.delete(target);

      return { kind: "success", game: target };
    } catch (e) {
      console.warn(e);
      return { kind: "failed" };
    }
  };
};
