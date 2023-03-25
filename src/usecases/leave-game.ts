import { EventDispatcher, UseCase } from "./base";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import * as User from "@/domains/user";

export interface LeaveGameUseCaseInput {
  gameId: Game.Id;
  userId: User.Id;
}

export type LeaveGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFound" }
  | { kind: "ownerCanNotLeave" };

export class LeaveGameUseCase implements UseCase<LeaveGameUseCaseInput, Promise<LeaveGameUseCaseOutput>> {
  constructor(private gameRepository: GameRepository, private dispatcher: EventDispatcher) {}

  async execute(input: LeaveGameUseCaseInput): Promise<LeaveGameUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);

    if (!game) {
      return { kind: "notFound" };
    }
    const [newGame, event] = Game.acceptLeaveFrom(game, input.userId);

    if (!event) {
      return { kind: "ownerCanNotLeave" };
    }

    await this.gameRepository.save(newGame);
    this.dispatcher.dispatch(event);

    return { kind: "success", game: newGame };
  }
}
