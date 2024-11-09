import { User, UserRepository } from "@spp/shared-domain";
import { EventDispatcher, UseCase } from "./base.js";

export interface ChangeUserNameInput {
  userId: User.Id;
  name: string;
}

export type ChangeUserNameOutput =
  | { kind: "success"; user: User.T }
  | { kind: "canNotChangeName" }
  | { kind: "notFound" };

export type ChangeUserNameUseCase = UseCase<ChangeUserNameInput, ChangeUserNameOutput>;

/**
 * Get new use case instance to chagne user name
 */
export const newChangeUserNameUseCase = function newChangeUserNameUseCase(
  dispatcher: EventDispatcher,
  userRepository: UserRepository.T
): ChangeUserNameUseCase {
  return async (input) => {
    const user = await userRepository.findBy(input.userId);
    if (!user) {
      return { kind: "notFound" };
    }

    if (!User.canChangeName(input.name)) {
      return { kind: "canNotChangeName" };
    }

    const [newUser, event] = User.changeName(user, input.name);
    await userRepository.save(newUser);

    if (event) {
      dispatcher(event);
    }

    return { kind: "success", user: newUser };
  };
};
