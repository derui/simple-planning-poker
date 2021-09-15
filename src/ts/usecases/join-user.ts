import { GameId } from "@/domains/game";
import { InvitationService } from "@/domains/invitation-service";
import { UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  gameId: GameId;
  userId: UserId;
}

export type JoinUserUseCaseOutput = { kind: "success" } | { kind: "notFoundUser" };

export class JoinUserUseCase implements UseCase<JoinUserUseCaseInput, Promise<JoinUserUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private userRepository: UserRepository,
    private invitationService: InvitationService
  ) {}

  async execute(input: JoinUserUseCaseInput): Promise<JoinUserUseCaseOutput> {
    const user = await this.userRepository.findBy(input.userId);

    if (!user) {
      return { kind: "notFoundUser" };
    }
    const events = await this.invitationService.invite(user, input.gameId);

    events.forEach(this.dispatcher.dispatch);

    return { kind: "success" };
  }
}
