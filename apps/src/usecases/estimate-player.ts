import { UseCase } from "./base";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import * as UserEstimation from "@/domains/user-estimation";
import { RoundRepository } from "@/domains/round-repository";

export interface EstimatePlayerUseCaseInput {
  userId: User.Id;
  roundId: Round.Id;
  userEstimation: UserEstimation.T;
}

export type EstimatePlayerUseCaseOutput =
  | { kind: "success"; round: Round.T }
  | { kind: "notFound" }
  | { kind: "EstimatePlayerFailed" };

export class EstimatePlayerUseCase
  implements UseCase<EstimatePlayerUseCaseInput, Promise<EstimatePlayerUseCaseOutput>>
{
  constructor(private roundRepository: RoundRepository) {}

  async execute(input: EstimatePlayerUseCaseInput): Promise<EstimatePlayerUseCaseOutput> {
    const round = await this.roundRepository.findBy(input.roundId);
    if (!round) {
      return { kind: "notFound" };
    }

    try {
      const newGame = Round.takePlayerEstimation(round, input.userId, input.userEstimation);
      await this.roundRepository.save(newGame);

      return { kind: "success", round: newGame };
    } catch (e) {
      console.error(e);

      return { kind: "EstimatePlayerFailed" };
    }
  }
}
