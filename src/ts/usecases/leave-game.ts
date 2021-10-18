import { GameId } from "~/src/ts/domains/game";
import { UserId } from "~/src/ts/domains/user";
import { UserRepository } from "~/src/ts/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface LeaveGameUseCaseInput {
  gameId: GameId;
  userId: UserId;
}

export type LeaveGameUseCaseOutput = { kind: "success" } | { kind: "notFoundUser" } | { kind: "leaveFailed" };

export class LeaveGameUseCase implements UseCase<LeaveGameUseCaseInput, Promise<LeaveGameUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private userRepository: UserRepository) {}

  async execute(input: LeaveGameUseCaseInput): Promise<LeaveGameUseCaseOutput> {
    const user = await this.userRepository.findBy(input.userId);

    if (!user) {
      return { kind: "notFoundUser" };
    }
    const event = user.leaveFrom(input.gameId);
    this.userRepository.save(user);

    if (!event) {
      return { kind: "leaveFailed" };
    }
    this.dispatcher.dispatch(event);

    return { kind: "success" };
  }
}
