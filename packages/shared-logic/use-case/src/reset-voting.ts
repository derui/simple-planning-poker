import { Voting } from "@spp/shared-domain";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace ResetVotingUseCase {
  export interface Input {
    votingId: Voting.Id;
  }

  export type Output = { kind: "success"; voting: Voting.T } | { kind: "error"; detail: ErrorDetail };

  export type ErrorDetail = "notFound" | "canNotResetVoting";
}

export type ResetVotingUseCase = UseCase<ResetVotingUseCase.Input, ResetVotingUseCase.Output>;

/**
 * Get new instance of use case to reset voting
 */
export const ResetVotingUseCase: ResetVotingUseCase = async (input) => {
  const voting = await VotingRepository.findBy({ id: input.votingId });
  if (!voting) {
    return { kind: "error", detail: "notFound" };
  }

  try {
    const [newVoting, event] = Voting.reset(voting);

    await VotingRepository.save({ voting: newVoting });

    dispatch(event);

    return { kind: "success", voting: newVoting };
  } catch (e) {
    console.error(e);

    return { kind: "error", detail: "canNotResetVoting" };
  }
};
