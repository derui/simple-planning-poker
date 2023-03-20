import { EventDispatcher, UseCase } from "./base";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";

export interface NewRoundUseCaseInput {
  gameId: Game.Id;
}

export type NewRoundUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "notFoundGame" }
  | { kind: "canNotStartNewRound" };

export class NewRoundUseCase implements UseCase<NewRoundUseCaseInput, Promise<NewRoundUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: NewRoundUseCaseInput): Promise<NewRoundUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    try {
      const [newGame, event] = Game.newRound(game);

      await this.gameRepository.save(newGame);

      this.dispatcher.dispatch(event);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "canNotStartNewRound" };
    }
  }
}
