import { User, UserEstimation, Voting } from "@spp/shared-domain";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";

export namespace EstimatePlayerUseCase {
  export interface Input {
    userId: User.Id;
    votingId: Voting.Id;
    userEstimation: UserEstimation.T;
  }

  export type Output = { kind: "success"; voting: Voting.T } | { kind: "error"; detail: ErrorDetail };

  export type ErrorDetail = "notFound" | "failed";
}

export type EstimatePlayerUseCase = UseCase<EstimatePlayerUseCase.Input, EstimatePlayerUseCase.Output>;

/**
 * The command to estimate a player.
 */
export const EstimatePlayerUseCase: EstimatePlayerUseCase = async (input) => {
  const voting = await VotingRepository.findBy({ id: input.votingId });
  if (!voting) {
    return { kind: "error", detail: "notFound" };
  }

  try {
    const newVoting = Voting.takePlayerEstimation(voting, input.userId, input.userEstimation);
    await VotingRepository.save({ voting: newVoting });

    return { kind: "success", voting: newVoting };
  } catch (e) {
    console.error(e);

    return { kind: "error", detail: "failed" };
  }
};
