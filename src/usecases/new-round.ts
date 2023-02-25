import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { EventDispatcher, UseCase } from "./base";

export interface NewRoundUseCaseInput {
  gameId: Game.Id;
}

export type NewRoundUseCaseOutput = "success" | "notFoundGame" | "canNotStartNewRound";

export class NewRoundUseCase implements UseCase<NewRoundUseCaseInput, Promise<NewRoundUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: NewRoundUseCaseInput): Promise<NewRoundUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return "notFoundGame";
    }

    try {
      const [newGame, event] = Game.newRound(game);

      this.dispatcher.dispatch(event);
      this.gameRepository.save(newGame);

      return "success";
    } catch (e) {
      console.error(e);

      return "canNotStartNewRound";
    }
  }
}