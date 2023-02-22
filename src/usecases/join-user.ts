import { Id } from "@/domains/game-player";
import { InvitationSignature } from "@/domains/invitation";
import { JoinService } from "@/domains/join-service";
import { Id } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  signature: InvitationSignature;
  userId: Id;
}

export type JoinUserUseCaseOutput =
  | { kind: "success"; gamePlayerId: Id }
  | { kind: "notFoundUser" }
  | { kind: "joinFailed" };

export class JoinUserUseCase implements UseCase<JoinUserUseCaseInput, Promise<JoinUserUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private userRepository: UserRepository,
    private joinService: JoinService
  ) {}

  async execute(input: JoinUserUseCaseInput): Promise<JoinUserUseCaseOutput> {
    const user = await this.userRepository.findBy(input.userId);

    if (!user) {
      return { kind: "notFoundUser" };
    }
    const event = await this.joinService.join(user, input.signature);

    if (!event) {
      return { kind: "joinFailed" };
    }
    this.dispatcher.dispatch(event);

    return { kind: "success", gamePlayerId: event.gamePlayerId };
  }
}
