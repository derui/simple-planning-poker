import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface LeaveGameUseCaseInput {
  gameId: Game.Id;
  userId: User.Id;
}

export type LeaveGameUseCaseOutput = { kind: "success" } | { kind: "notFoundUser" } | { kind: "leaveFailed" };

export class LeaveGameUseCase implements UseCase<LeaveGameUseCaseInput, Promise<LeaveGameUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private userRepository: UserRepository) {}

  async execute(input: LeaveGameUseCaseInput): Promise<LeaveGameUseCaseOutput> {
    const user = await this.userRepository.findBy(input.userId);

    if (!user) {
      return { kind: "notFoundUser" };
    }
    const [newUser, event] = User.leaveFrom(user, input.gameId);
    this.userRepository.save(newUser);

    if (!event) {
      return { kind: "leaveFailed" };
    }
    this.dispatcher.dispatch(event);

    return { kind: "success" };
  }
}
