import { Voting } from "@spp/shared-domain";
import { VotingRepository } from "@spp/shared-domain/voting-repository";
import { UseCase } from "./base.js";

export namespace ChangeThemeUseCase {
  export interface Input {
    votingId: Voting.Id;
    theme: string;
  }

  export type Output = { kind: "success"; voting: Voting.T } | { kind: "canNotChangeTheme" } | { kind: "notFound" };
}

export type ChangeThemeUseCase = UseCase<ChangeThemeUseCase.Input, ChangeThemeUseCase.Output>;

/**
 * Get new instance of use case
 */
export const ChangeThemeUseCase: ChangeThemeUseCase = async (input) => {
  const voting = await VotingRepository.findBy({ id: input.votingId });
  if (!voting) {
    return { kind: "notFound" };
  }

  if (voting.status == Voting.VotingStatus.Revealed) {
    return { kind: "canNotChangeTheme" };
  }

  const newVoting = Voting.changeTheme(voting, input.theme);
  await VotingRepository.save({ voting: newVoting });

  return { kind: "success", voting: newVoting };
};
