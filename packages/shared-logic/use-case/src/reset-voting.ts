import { EventDispatcher, UseCase } from "./base.js";
import { Voting, VotingRepository } from "@spp/shared-domain";

export interface ResetVotingUseCaseInput {
  votingId: Voting.Id;
}

export type ResetVotingUseCaseOutput =
  | { kind: "success"; voting: Voting.T }
  | { kind: "notFound" }
  | { kind: "canNotResetVoting" };

export type ResetVotingUseCase = UseCase<ResetVotingUseCaseInput, ResetVotingUseCaseOutput>;

/**
 * Get new instance of use case to reset voting
 */
export const newResetVotingUseCase = function newResetVotingUseCase(
  dispatcher: EventDispatcher,
  votingRepository: VotingRepository.T
): ResetVotingUseCase {
  return async (input) => {
    const voting = await votingRepository.findBy(input.votingId);
    if (!voting) {
      return { kind: "notFound" };
    }

    try {
      const [newVoting, event] = Voting.reset(voting);

      await votingRepository.save(newVoting);

      dispatcher(event);

      return { kind: "success", voting: newVoting };
    } catch (e) {
      console.error(e);

      return { kind: "canNotResetVoting" };
    }
  };
};
