import { EventDispatcher, UseCase } from "./base";
import * as Game from "@/domains/game";
import * as Round from "@/domains/round";
import { GameRepository } from "@/domains/game-repository";
import { RoundRepository } from "@/domains/round-repository";

export interface NewRoundUseCaseInput {
  gameId: Game.Id;
}

export type NewRoundUseCaseOutput =
  | { kind: "success"; round: Round.T }
  | { kind: "notFound" }
  | { kind: "canNotStartNewRound" };

export class NewRoundUseCase implements UseCase<NewRoundUseCaseInput, Promise<NewRoundUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private gameRepository: GameRepository,
    private roundRepository: RoundRepository
  ) {}

  async execute(input: NewRoundUseCaseInput): Promise<NewRoundUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFound" };
    }

    try {
      const [newRound, event] = Game.newRound(game);

      await this.roundRepository.save(newRound);

      this.dispatcher.dispatch(event);

      return { kind: "success", round: newRound };
    } catch (e) {
      console.error(e);

      return { kind: "canNotStartNewRound" };
    }
  }
}
