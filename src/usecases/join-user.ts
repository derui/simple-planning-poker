import * as GamePlayer from "@/domains/game-player";
import * as Invitation from "@/domains/invitation";
import * as JoinService from "@/domains/join-service";
import * as User from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  signature: Invitation.InvitationSignature;
  userId: User.Id;
}

export type JoinUserUseCaseOutput =
  | { kind: "success"; gamePlayerId: GamePlayer.Id }
  | { kind: "notFoundUser" }
  | { kind: "joinFailed" };

export class JoinUserUseCase implements UseCase<JoinUserUseCaseInput, Promise<JoinUserUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private userRepository: UserRepository,
    private joinService: JoinService.JoinService
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
