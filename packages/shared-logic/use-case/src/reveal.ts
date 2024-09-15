import { EventDispatcher, UseCase } from "./base.js";
import { Voting, VotingRepository } from "@spp/shared-domain";

export interface RevealUseCaseInput {
  votingId: Voting.Id;
}

export type RevealUseCaseOutput =
  | {
      kind: "success";
      voting: Voting.T;
    }
  | { kind: "notFoundVoting" }
  | { kind: "revealed" };

/**
 * Get new instance of use case to reveal a voting
 */
export const newRevealUseCase = function newRevealUseCase(
  dispatcher: EventDispatcher,
  votingRepository: VotingRepository.T
): UseCase<RevealUseCaseInput, RevealUseCaseOutput> {
  return async (input) => {
    const voting = await votingRepository.findBy(input.votingId);
    if (!voting) {
      return { kind: "notFoundVoting" };
    }

    if (voting.status == Voting.VotingStatus.Revealed) {
      return { kind: "revealed" };
    }

    try {
      const [newVoting, event] = Voting.reveal(voting);

      await votingRepository.save(newVoting);

      dispatcher(event);

      return { kind: "success", voting: newVoting };
    } catch (e) {
      console.error(e);

      return { kind: "revealed" };
    }
  };
};
