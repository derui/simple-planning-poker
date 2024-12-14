import { User } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { UseCase } from "./base.js";
import { dispatch } from "./event-dispatcher.js";

export namespace ChangeUserNameUseCase {
  export interface Input {
    userId: User.Id;
    name: string;
  }

  export type Output = { kind: "success"; user: User.T } | { kind: "canNotChangeName" } | { kind: "notFound" };
}

export type ChangeUserNameUseCase = UseCase<ChangeUserNameUseCase.Input, ChangeUserNameUseCase.Output>;

/**
 * Get new use case instance to chagne user name
 */
export const ChangeUserNameUseCase: ChangeUserNameUseCase = async (input) => {
  const user = await UserRepository.findBy({ id: input.userId });
  if (!user) {
    return { kind: "notFound" };
  }

  if (!User.canChangeName(input.name)) {
    return { kind: "canNotChangeName" };
  }

  const [newUser, event] = User.changeName(user, input.name);
  await UserRepository.save({ user: newUser });

  if (event) {
    dispatch(event);
  }

  return { kind: "success", user: newUser };
};
