import { EventDispatcher, UseCase } from "./base.js";
import { User, VotingRepository, Voter, Voting } from "@spp/shared-domain";

export interface ChangeUserModeInput {
  userId: User.Id;
  votingId: Voting.Id;
  voterType: Voter.VoterType;
}

export type ChangeUserModeOutput = { kind: "success"; voting: Voting.T } | { kind: "notFound" };
export type ChangeUserModeUseCase = UseCase<ChangeUserModeInput, ChangeUserModeOutput>;

export const newChangeUserModeUseCase = function newChangeUserModeUseCase(
  votingRepository: VotingRepository.T,
  dispatcher: EventDispatcher
): ChangeUserModeUseCase {
  return async (input: ChangeUserModeInput): Promise<ChangeUserModeOutput> => {
    const voting = await votingRepository.findBy(input.votingId);
    if (!voting) {
      return { kind: "notFound" };
    }
    const voter = voting.participatedVoters.find((v) => v.user == input.userId);
    if (!voter) {
      return { kind: "notFound" };
    }

    const [newVoting, event] = Voting.updateVoter(voting, Voter.changeVoterType(voter, input.voterType));
    await votingRepository.save(newVoting);
    dispatcher(event);

    return { kind: "success", voting: newVoting };
  };
};
