import { GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { EventDispatcher, UseCase } from "./base";

export interface ShowDownUseCaseInput {
  gameId: GameId;
}

export type ShowDownUseCaseOutput = { kind: "success" } | { kind: "notFoundGame" };

export class ShowDownUseCase implements UseCase<ShowDownUseCaseInput, Promise<ShowDownUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: ShowDownUseCaseInput): Promise<ShowDownUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    const event = game.showDown();

    if (event) {
      this.dispatcher.dispatch(event);
    }

    this.gameRepository.save(game);

    return { kind: "success" };
  }
}
