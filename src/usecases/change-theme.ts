import { UseCase } from "./base";
import * as Round from "@/domains/round";
import { RoundRepository } from "@/domains/round-repository";

export interface ChangeThemeInput {
  roundId: Round.Id;
  theme: string;
}

export type ChangeThemeOutput =
  | { kind: "success"; round: Round.T }
  | { kind: "canNotChangeTheme" }
  | { kind: "notFound" };

export class ChangeThemeUseCase implements UseCase<ChangeThemeInput, Promise<ChangeThemeOutput>> {
  constructor(private roundRepository: RoundRepository) {}

  async execute(input: ChangeThemeInput): Promise<ChangeThemeOutput> {
    const round = await this.roundRepository.findBy(input.roundId);
    if (!round) {
      return { kind: "notFound" };
    }

    if (Round.isFinishedRound(round)) {
      return { kind: "canNotChangeTheme" };
    }

    const newRound = Round.changeTheme(round, input.theme);
    this.roundRepository.save(newRound);

    return { kind: "success", round: newRound };
  }
}
