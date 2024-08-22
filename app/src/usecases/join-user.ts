import { EventDispatcher, UseCase } from "./base";
import { GameRepository } from "@/domains/game-repository";
import * as Invitation from "@/domains/invitation";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { UserRepository } from "@/domains/user-repository";

export interface JoinUserUseCaseInput {
  signature: Invitation.T;
  userId: User.Id;
}

export type JoinUserUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFoundUser" }
  | { kind: "notFoundGame" }
  | { kind: "joinFailed" };

export class JoinUserUseCase implements UseCase<JoinUserUseCaseInput, Promise<JoinUserUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private userRepository: UserRepository,
    private gameRepository: GameRepository
  ) {}

  async execute(input: JoinUserUseCaseInput): Promise<JoinUserUseCaseOutput> {
    const user = await this.userRepository.findBy(input.userId);

    if (!user) {
      return { kind: "notFoundUser" };
    }
    const game = await this.gameRepository.findByInvitation(input.signature);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    try {
      const [newGame, event] = Game.joinUserAsPlayer(game, user.id, input.signature);
      await this.gameRepository.save(newGame);

      this.dispatcher.dispatch(event);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "joinFailed" };
    }
  }
}
