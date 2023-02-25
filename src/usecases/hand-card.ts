import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as UserHand from "@/domains/user-hand";
import { UseCase } from "./base";
import { GameRepository } from "@/domains/game-repository";

export interface HandCardUseCaseInput {
  userId: User.Id;
  gameId: Game.Id;
  userHand: UserHand.T;
}

export type HandCardUseCaseOutput = "success" | "notFoundGame" | "HandCardFailed";

export class HandCardUseCase implements UseCase<HandCardUseCaseInput, Promise<HandCardUseCaseOutput>> {
  constructor(private gameRepository: GameRepository) {}

  async execute(input: HandCardUseCaseInput): Promise<HandCardUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return "notFoundGame";
    }

    try {
      const newGame = Game.acceptPlayerHand(game, input.userId, input.userHand);
      this.gameRepository.save(newGame);

      return "success";
    } catch (e) {
      console.error(e);

      return "HandCardFailed";
    }
  }
}
