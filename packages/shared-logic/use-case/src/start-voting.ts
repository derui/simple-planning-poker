import { Game, GameRepository, Voting, VotingRepository } from "@spp/shared-domain";
import { Prettify } from "@spp/shared-type-util";
import { UseCase } from "./base.js";

export interface StartVotingUseCaseInput {
  gameId: Game.Id;
}

export type StartVotingUseCaseOutput =
  | { kind: "success"; voting: Voting.T }
  | { kind: "notFound" }
  | { kind: "failed" };

export type StartVotingUseCase = UseCase<StartVotingUseCaseInput, StartVotingUseCaseOutput>;

export const newStartVotingUseCase = function newStartVotingUseCase(
  gameRepository: Prettify<GameRepository.T>,
  votingRepository: Prettify<VotingRepository.T>
): StartVotingUseCase {
  return async (input) => {
    const game = await gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFound" };
    }

    const voting = Game.newVoting(game);

    try {
      await votingRepository.save(voting);
    } catch (e) {
      console.warn(e);
      return { kind: "failed" };
    }

    return { kind: "success", voting };
  };
};
