import { User, Voting } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace JoinVotingUseCase {
  export interface Input {
    userId: User.Id;
    votingId: Voting.Id;
  }

  export type Output = { kind: "success"; voting: Voting.T } | { kind: "error"; detail: ErrorDetail };

  export type ErrorDetail = "notFound" | "userNotFound" | "AlreadyJoined";
}

export type JoinVotingUseCase = UseCase<JoinVotingUseCase.Input, JoinVotingUseCase.Output>;

/**
 * The command to join a voting.
 */
export const JoinVotingUseCase: JoinVotingUseCase = async (input) => {
  const voting = await VotingRepository.findBy({ id: input.votingId });
  if (!voting) {
    return { kind: "error", detail: "notFound" };
  }

  const user = await UserRepository.findBy({ id: input.userId });
  if (!user) {
    return { kind: "error", detail: "userNotFound" };
  }

  try {
    const [newVoting, event] = Voting.joinUser(voting, user.id);
    await VotingRepository.save({ voting: newVoting });

    if (event) {
      dispatch(event);
    }

    return { kind: "success", voting: newVoting };
  } catch (e) {
    console.error(e);

    return { kind: "error", detail: "AlreadyJoined" };
  }
};
