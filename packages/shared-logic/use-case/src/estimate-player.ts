import { UseCase } from "./base.js";
import { User, Voting, UserEstimation, VotingRepository } from "@spp/shared-domain";

export interface EstimatePlayerUseCaseInput {
  userId: User.Id;
  votingId: Voting.Id;
  userEstimation: UserEstimation.T;
}

export type EstimatePlayerUseCaseOutput =
  | { kind: "success"; voting: Voting.T }
  | { kind: "notFound" }
  | { kind: "EstimatePlayerFailed" };

export type EstimatePlayerUseCase = UseCase<EstimatePlayerUseCaseInput, EstimatePlayerUseCaseOutput>;

export const newEstimatePlayerUseCase = function newEstimatePlayerUseCase(
  votingRepository: VotingRepository.T
): EstimatePlayerUseCase {
  return async (input: EstimatePlayerUseCaseInput): Promise<EstimatePlayerUseCaseOutput> => {
    const voting = await votingRepository.findBy(input.votingId);
    if (!voting) {
      return { kind: "notFound" };
    }

    try {
      const newVoting = Voting.takePlayerEstimation(voting, input.userId, input.userEstimation);
      await votingRepository.save(newVoting);

      return { kind: "success", voting: newVoting };
    } catch (e) {
      console.error(e);

      return { kind: "EstimatePlayerFailed" };
    }
  };
};
