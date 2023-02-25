import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { EventDispatcher, UseCase } from "./base";

export interface ShowDownUseCaseInput {
  gameId: Game.Id;
}

export type ShowDownUseCaseOutput = "success" | "notFoundGame" | "showDownFailed";

export class ShowDownUseCase implements UseCase<ShowDownUseCaseInput, Promise<ShowDownUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: ShowDownUseCaseInput): Promise<ShowDownUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return "notFoundGame";
    }

    try {
      const [newGame, event] = Game.showDown(game, new Date());

      this.gameRepository.save(newGame);

      this.dispatcher.dispatch(event);

      return "success";
    } catch (e) {
      console.error(e);

      return "showDownFailed";
    }
  }
}
