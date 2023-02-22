import { Id } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface ChangeUserNameInput {
  userId: Id;
  name: string;
}

export type ChangeUserNameOutput = { kind: "success" } | { kind: "canNotChangeName" } | { kind: "notFound" };

export class ChangeUserNameUseCase implements UseCase<ChangeUserNameInput, Promise<ChangeUserNameOutput>> {
  constructor(private dispatcher: EventDispatcher, private userRepository: UserRepository) {}

  async execute(input: ChangeUserNameInput): Promise<ChangeUserNameOutput> {
    const user = await this.userRepository.findBy(input.userId);
    if (!user) {
      return { kind: "notFound" };
    }

    if (!user.canChangeName(input.name)) {
      return { kind: "canNotChangeName" };
    }

    const event = user.changeName(input.name);
    this.userRepository.save(user);

    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
