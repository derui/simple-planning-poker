import { User, UserRepository, VoterType } from "@spp/shared-domain";
import { UseCase } from "./base.js";

export interface ChangeDefaultVoterTypeUseCaseInput {
  userId: User.Id;
  voterType: VoterType.T;
}

export type ChangeDefaultVoterTypeUseCaseOutput = { kind: "success"; user: User.T } | { kind: "notFound" };
export type ChangeDefaultVoterTypeUseCase = UseCase<
  ChangeDefaultVoterTypeUseCaseInput,
  ChangeDefaultVoterTypeUseCaseOutput
>;

export const newChangeDefaultVoterTypeUseCase = function newChangeDefaultVoterTypeUseCase(
  userRepository: UserRepository.T
): ChangeDefaultVoterTypeUseCase {
  return async (input: ChangeDefaultVoterTypeUseCaseInput): Promise<ChangeDefaultVoterTypeUseCaseOutput> => {
    const user = await userRepository.findBy(input.userId);
    if (!user) {
      return { kind: "notFound" };
    }

    const newUser = User.changeDefaultVoterType(user, input.voterType);

    await userRepository.save(newUser);

    return { kind: "success", user: newUser };
  };
};
