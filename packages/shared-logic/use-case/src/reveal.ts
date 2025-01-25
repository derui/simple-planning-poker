import { Voting } from "@spp/shared-domain";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace RevealUseCase {
  export interface Input {
    votingId: Voting.Id;
  }

  export type ErrorDetail = "notFoundVoting" | "revealed" | "failed";

  export type Output =
    | {
        kind: "success";
        voting: Voting.T;
      }
    | { kind: "error"; detail: ErrorDetail };
}

export type RevealUseCase = UseCase<RevealUseCase.Input, RevealUseCase.Output>;

/**
 * Get new instance of use case to reveal a voting
 */
export const RevealUseCase: RevealUseCase = async (input) => {
  const voting = await VotingRepository.findBy({ id: input.votingId });
  if (!voting) {
    return { kind: "error", detail: "notFoundVoting" };
  }

  if (voting.status == Voting.VotingStatus.Revealed) {
    return { kind: "error", detail: "revealed" };
  }

  try {
    const [newVoting, event] = Voting.reveal(voting);

    await VotingRepository.save({ voting: newVoting });

    dispatch(event);

    return { kind: "success", voting: newVoting };
  } catch (e) {
    console.error(e);

    return { kind: "error", detail: "failed" };
  }
};
