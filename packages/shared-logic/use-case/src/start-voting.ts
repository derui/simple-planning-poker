import { Game, Voting } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace StartVotingUseCase {
  export interface Input {
    gameId: Game.Id;
  }

  export type Output = { kind: "success"; voting: Voting.T } | { kind: "error"; detail: ErrorDetail };

  export type ErrorDetail = "notFound" | "failed";
}

export type StartVotingUseCase = UseCase<StartVotingUseCase.Input, StartVotingUseCase.Output>;

export const StartVotingUseCase: StartVotingUseCase = async (input) => {
  const game = await GameRepository.findBy({ id: input.gameId });
  if (!game) {
    return { kind: "error", detail: "notFound" };
  }

  const [voting, event] = Game.newVoting(game);

  try {
    await VotingRepository.save({ voting });
  } catch (e) {
    console.warn(e);
    return { kind: "error", detail: "failed" };
  }
  dispatch(event);

  return { kind: "success", voting };
};
