import { GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { EventDispatcher, UseCase } from "./base";

export interface NewGameUseCaseInput {
  gameId: GameId;
}

export type NewGameUseCaseOutput = { kind: "success" } | { kind: "notFoundGame" };

export class NewGameUseCase implements UseCase<NewGameUseCaseInput, NewGameUseCaseOutput> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  execute(input: NewGameUseCaseInput): NewGameUseCaseOutput {
    const game = this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    const event = game.newGame();

    this.dispatcher.dispatch(event);
    this.gameRepository.save(game);

    return { kind: "success" };
  }
}
