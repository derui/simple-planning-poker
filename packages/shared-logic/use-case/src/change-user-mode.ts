import { User, Voter, VoterType, Voting } from "@spp/shared-domain";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace ChangeUserModeUseCase {
  export interface Input {
    userId: User.Id;
    votingId: Voting.Id;
    voterType: VoterType.T;
  }

  export type Output = { kind: "success"; voting: Voting.T } | { kind: "notFound" };
}

export type ChangeUserModeUseCase = UseCase<ChangeUserModeUseCase.Input, ChangeUserModeUseCase.Output>;

/**
 * Change user mode in the voting
 */
export const ChangeUserModeUseCase: ChangeUserModeUseCase = async (input) => {
  const voting = await VotingRepository.findBy({ id: input.votingId });
  if (!voting) {
    return { kind: "notFound" };
  }
  const voter = voting.participatedVoters.find((v) => v.user == input.userId);
  if (!voter) {
    return { kind: "notFound" };
  }

  const [newVoting, event] = Voting.updateVoter(voting, Voter.changeVoterType(voter, input.voterType));
  await VotingRepository.save({ voting: newVoting });
  dispatch(event);

  return { kind: "success", voting: newVoting };
};
