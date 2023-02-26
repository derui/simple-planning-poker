import * as User from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface ChangeUserNameInput {
  userId: User.Id;
  name: string;
}

export type ChangeUserNameOutput =
  | { kind: "success"; user: User.T }
  | { kind: "canNotChangeName" }
  | { kind: "notFound" };

export class ChangeUserNameUseCase implements UseCase<ChangeUserNameInput, Promise<ChangeUserNameOutput>> {
  constructor(private dispatcher: EventDispatcher, private userRepository: UserRepository) {}

  async execute(input: ChangeUserNameInput): Promise<ChangeUserNameOutput> {
    const user = await this.userRepository.findBy(input.userId);
    if (!user) {
      return { kind: "notFound" };
    }

    if (!User.canChangeName(input.name)) {
      return { kind: "canNotChangeName" };
    }

    const [newUser, event] = User.changeName(user, input.name);
    this.userRepository.save(newUser);

    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success", user: newUser };
  }
}
