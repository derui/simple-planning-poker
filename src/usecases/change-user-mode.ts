import * as GamePlayer from "@/domains/game-player";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { UseCase } from "./base";

export interface ChangeUserModeInput {
  userId: User.Id;
  gameId: Game.Id;
  mode: GamePlayer.UserMode;
}

export type ChangeUserModeOutput = { kind: "success"; game: Game.T } | { kind: "notFound" };

export class ChangeUserModeUseCase implements UseCase<ChangeUserModeInput, Promise<ChangeUserModeOutput>> {
  constructor(private gameRepository: GameRepository) {}

  async execute(input: ChangeUserModeInput): Promise<ChangeUserModeOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFound" };
    }

    const newGame = Game.declarePlayerTo(game, input.userId, input.mode);
    await this.gameRepository.save(newGame);

    return { kind: "success", game: newGame };
  }
}
