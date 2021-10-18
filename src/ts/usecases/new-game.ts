import { GameId } from "~/src/ts/domains/game";
import { GameRepository } from "~/src/ts/domains/game-repository";
import { EventDispatcher, UseCase } from "./base";

export interface NewGameUseCaseInput {
  gameId: GameId;
}

export type NewGameUseCaseOutput = { kind: "success" } | { kind: "notFoundGame" };

export class NewGameUseCase implements UseCase<NewGameUseCaseInput, Promise<NewGameUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: NewGameUseCaseInput): Promise<NewGameUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    const event = game.newGame();

    this.dispatcher.dispatch(event);
    this.gameRepository.save(game);

    return { kind: "success" };
  }
}
