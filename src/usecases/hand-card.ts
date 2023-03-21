import { UseCase } from "./base";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as UserEstimation from "@/domains/user-estimation";
import { GameRepository } from "@/domains/game-repository";

export interface HandCardUseCaseInput {
  userId: User.Id;
  gameId: Game.Id;
  userHand: UserEstimation.T;
}

export type HandCardUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFoundGame" }
  | { kind: "HandCardFailed" };

export class HandCardUseCase implements UseCase<HandCardUseCaseInput, Promise<HandCardUseCaseOutput>> {
  constructor(private gameRepository: GameRepository) {}

  async execute(input: HandCardUseCaseInput): Promise<HandCardUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    try {
      const newGame = Game.acceptPlayerHand(game, input.userId, input.userHand);
      this.gameRepository.save(newGame);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "HandCardFailed" };
    }
  }
}
