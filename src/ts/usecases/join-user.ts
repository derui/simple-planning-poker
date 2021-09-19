import { GameId } from "@/domains/game";
import { GamePlayerId } from "@/domains/game-player";
import { JoinService } from "@/domains/join-service";
import { UserId } from "@/domains/user";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  gameId: GameId;
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
    const event = await this.joinService.join(user, input.gameId);

    if (!event) {
      return { kind: "joinFailed" };
    }
    this.dispatcher.dispatch(event);

    return { kind: "success", gamePlayerId: event.gamePlayerId };
  }
}
