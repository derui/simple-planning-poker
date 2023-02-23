import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { EventDispatcher, UseCase } from "./base";

export interface NewGameUseCaseInput {
  gameId: Game.GameId;
}

export type NewGameUseCaseOutput = { kind: "success" } | { kind: "notFoundGame" };

export class NewGameUseCase implements UseCase<NewGameUseCaseInput, Promise<NewGameUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: NewGameUseCaseInput): Promise<NewGameUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    const [newGame, event] = Game.newGame(game);

    this.dispatcher.dispatch(event);
    this.gameRepository.save(newGame);

    return { kind: "success" };
  }
}
