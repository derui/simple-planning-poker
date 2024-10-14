import { EventDispatcher, UseCase } from "./base.js";
import { User, UserRepository, Voting, VotingRepository } from "@spp/shared-domain";

export interface JoinVotingUseCaseInput {
  userId: User.Id;
  votingId: Voting.Id;
}

export type JoinVotingUseCaseOutput =
  | { kind: "success"; voting: Voting.T }
  | { kind: "notFound" }
  | { kind: "userNotFound" }
  | { kind: "AlreadyJoined" };

export type JoinVotingUseCase = UseCase<JoinVotingUseCaseInput, JoinVotingUseCaseOutput>;

export const newJoinVotingUseCase = function newJoinVotingUseCase(
  votingRepository: VotingRepository.T,
  userRepository: UserRepository.T,
  dispatcher: EventDispatcher
): JoinVotingUseCase {
  return async (input: JoinVotingUseCaseInput): Promise<JoinVotingUseCaseOutput> => {
    const voting = await votingRepository.findBy(input.votingId);
    if (!voting) {
      return { kind: "notFound" };
    }

    const user = await userRepository.findBy(input.userId);
    if (!user) {
      return { kind: "userNotFound" };
    }

    try {
      const [newVoting, event] = Voting.joinUser(voting, user.id);
      await votingRepository.save(newVoting);

      if (event) {
        dispatcher(event);
      }

      return { kind: "success", voting: newVoting };
    } catch (e) {
      console.error(e);

      return { kind: "AlreadyJoined" };
    }
  };
};
