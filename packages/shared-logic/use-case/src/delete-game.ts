import { Game, User } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { UseCase } from "./base.js";

export namespace DeleteGameUseCase {
  export interface Input {
    gameId: Game.Id;
    ownedBy: User.Id;
  }

  export type Output = { kind: "success"; game: Game.T } | { kind: "error"; detail: ErrorDetail };

  export type ErrorDetail = "notFound" | "doNotOwned" | "failed";
}

export type DeleteGameUseCase = UseCase<DeleteGameUseCase.Input, DeleteGameUseCase.Output>;

export const DeleteGameUseCase: DeleteGameUseCase = async (input) => {
  const target = await GameRepository.findBy({ id: input.gameId });
  if (!target) {
    return { kind: "error", detail: "notFound" };
  }

  if (target.owner != input.ownedBy) {
    return { kind: "error", detail: "doNotOwned" };
  }

  try {
    await GameRepository.delete({ game: target });

    return { kind: "success", game: target };
  } catch (e) {
    console.warn(e);
    return { kind: "error", detail: "failed" };
  }
};
