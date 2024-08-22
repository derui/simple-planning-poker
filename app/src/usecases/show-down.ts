import { EventDispatcher, UseCase } from "./base";
import * as Round from "@/domains/round";
import { RoundRepository } from "@/domains/round-repository";

export interface ShowDownUseCaseInput {
  roundId: Round.Id;
}

export type ShowDownUseCaseOutput =
  | {
      kind: "success";
      round: Round.T;
    }
  | { kind: "notFoundGame" }
  | { kind: "showDownFailed" };

export class ShowDownUseCase implements UseCase<ShowDownUseCaseInput, Promise<ShowDownUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private roundRepository: RoundRepository
  ) {}

  async execute(input: ShowDownUseCaseInput): Promise<ShowDownUseCaseOutput> {
    const round = await this.roundRepository.findBy(input.roundId);
    if (!round) {
      return { kind: "notFoundGame" };
    }

    if (Round.isFinishedRound(round)) {
      return { kind: "showDownFailed" };
    }

    try {
      const [newRound, event] = Round.showDown(round, new Date());

      await this.roundRepository.save(newRound);

      this.dispatcher.dispatch(event);

      return { kind: "success", round: newRound };
    } catch (e) {
      console.error(e);

      return { kind: "showDownFailed" };
    }
  }
}
