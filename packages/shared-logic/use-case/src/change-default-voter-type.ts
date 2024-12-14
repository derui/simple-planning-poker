import { User, VoterType } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { UseCase } from "./base.js";

/**
 * The command to change the default voter type of a user.
 */
export const ChangeDefaultVoterTypeUseCase: ChangeDefaultVoterTypeUseCase = async (input) => {
  const user = await UserRepository.findBy({ id: input.userId });
  if (!user) {
    return { kind: "notFound" };
  }

  const newUser = User.changeDefaultVoterType(user, input.voterType);

  await UserRepository.save({ user: newUser });

  return { kind: "success", user: newUser };
};

export type ChangeDefaultVoterTypeUseCase = UseCase<
  ChangeDefaultVoterTypeUseCase.Input,
  ChangeDefaultVoterTypeUseCase.Output
>;

export namespace ChangeDefaultVoterTypeUseCase {
  export interface Input {
    userId: User.Id;
    voterType: VoterType.T;
  }

  export type Output = { kind: "success"; user: User.T } | { kind: "notFound" };
}
