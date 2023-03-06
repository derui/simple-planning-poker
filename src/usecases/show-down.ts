import { EventDispatcher, UseCase } from "./base";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";

export interface ShowDownUseCaseInput {
  gameId: Game.Id;
}

export type ShowDownUseCaseOutput =
  | {
      kind: "success";
      game: Game.T;
    }
  | { kind: "notFoundGame" }
  | { kind: "showDownFailed" };

export class ShowDownUseCase implements UseCase<ShowDownUseCaseInput, Promise<ShowDownUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: ShowDownUseCaseInput): Promise<ShowDownUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    try {
      const [newGame, event] = Game.showDown(game, new Date());

      await this.gameRepository.save(newGame);

      this.dispatcher.dispatch(event);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "showDownFailed" };
    }
  }
}
