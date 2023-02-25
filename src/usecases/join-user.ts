import { GameRepository } from "@/domains/game-repository";
import * as Invitation from "@/domains/invitation";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { UserRepository } from "@/domains/user-repository";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  signature: Invitation.T;
  userId: User.Id;
}

export type JoinUserUseCaseOutput = "success" | "notFoundUser" | "notFoundGame" | "joinFailed";

export class JoinUserUseCase implements UseCase<JoinUserUseCaseInput, Promise<JoinUserUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private userRepository: UserRepository,
    private gameRepository: GameRepository
  ) {}

  async execute(input: JoinUserUseCaseInput): Promise<JoinUserUseCaseOutput> {
    const user = await this.userRepository.findBy(input.userId);

    if (!user) {
      return "notFoundUser";
    }
    const game = await this.gameRepository.findByInvitation(input.signature);
    if (!game) {
      return "notFoundGame";
    }

    try {
      const [newGame, event] = Game.joinUser(game, user.id, input.signature);
      await this.gameRepository.save(newGame);

      this.dispatcher.dispatch(event);

      return "success";
    } catch (e) {
      console.error(e);

      return "joinFailed";
    }
  }
}
