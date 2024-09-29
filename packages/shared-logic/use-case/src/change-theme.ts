import { UseCase } from "./base.js";
import { Voting, VotingRepository } from "@spp/shared-domain";

export interface ChangeThemeInput {
  votingId: Voting.Id;
  theme: string;
}

export type ChangeThemeOutput =
  | { kind: "success"; voting: Voting.T }
  | { kind: "canNotChangeTheme" }
  | { kind: "notFound" };

export type ChangeThemeUseCase = UseCase<ChangeThemeInput, ChangeThemeOutput>;

/**
 * Get new instance of use case
 */
export const newChangeThemeUseCase = function newChangeThemeUseCase(
  votingRepository: VotingRepository.T
): ChangeThemeUseCase {
  return async (input: ChangeThemeInput): Promise<ChangeThemeOutput> => {
    const voting = await votingRepository.findBy(input.votingId);
    if (!voting) {
      return { kind: "notFound" };
    }

    if (voting.status == Voting.VotingStatus.Revealed) {
      return { kind: "canNotChangeTheme" };
    }

    const newVoting = Voting.changeTheme(voting, input.theme);
    await votingRepository.save(newVoting);

    return { kind: "success", voting: newVoting };
  };
};
