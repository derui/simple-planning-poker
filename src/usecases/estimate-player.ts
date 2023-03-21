import { UseCase } from "./base";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as UserEstimation from "@/domains/user-estimation";
import { GameRepository } from "@/domains/game-repository";

export interface EstimatePlayerUseCaseInput {
  userId: User.Id;
  gameId: Game.Id;
  userEstimation: UserEstimation.T;
}

export type EstimatePlayerUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFoundGame" }
  | { kind: "EstimatePlayerFailed" };

export class EstimatePlayerUseCase
  implements UseCase<EstimatePlayerUseCaseInput, Promise<EstimatePlayerUseCaseOutput>>
{
  constructor(private gameRepository: GameRepository) {}

  async execute(input: EstimatePlayerUseCaseInput): Promise<EstimatePlayerUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    try {
      const newGame = Game.acceptPlayerEstimation(game, input.userId, input.userEstimation);
      this.gameRepository.save(newGame);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "EstimatePlayerFailed" };
    }
  }
}
