import { UseCase } from "./base";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import * as User from "@/domains/user";

export interface LeaveGameUseCaseInput {
  gameId: Game.Id;
  userId: User.Id;
}

export type LeaveGameUseCaseOutput = { kind: "success"; game: Game.T } | { kind: "notFoundGame" };

export class LeaveGameUseCase implements UseCase<LeaveGameUseCaseInput, Promise<LeaveGameUseCaseOutput>> {
  constructor(private gameRepository: GameRepository) {}

  async execute(input: LeaveGameUseCaseInput): Promise<LeaveGameUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);

    if (!game) {
      return { kind: "notFoundGame" };
    }
    const newGame = Game.acceptLeaveFrom(game, input.userId);
    await this.gameRepository.save(newGame);

    return { kind: "success", game: newGame };
  }
}
