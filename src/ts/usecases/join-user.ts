import { GamePlayerId } from "~/src/ts/domains/game-player";
import { InvitationSignature } from "~/src/ts/domains/invitation";
import { JoinService } from "~/src/ts/domains/join-service";
import { UserId } from "~/src/ts/domains/user";
import { UserRepository } from "~/src/ts/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  signature: InvitationSignature;
  userId: UserId;
}

export type JoinUserUseCaseOutput =
  | { kind: "success"; gamePlayerId: GamePlayerId }
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
