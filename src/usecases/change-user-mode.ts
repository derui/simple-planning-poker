import * as GamePlayer from "@/domains/game-player";
import { GamePlayerRepository } from "@/domains/game-player-repository";
import { EventDispatcher, UseCase } from "./base";

export interface ChangeUserModeInput {
  gamePlayerId: GamePlayer.Id;
  mode: GamePlayer.UserMode;
}

export type ChangeUserModeOutput = { kind: "success" } | { kind: "notFound" } | { kind: "canNotChangeMode" };

export class ChangeUserModeUseCase implements UseCase<ChangeUserModeInput, Promise<ChangeUserModeOutput>> {
  constructor(private dispatcher: EventDispatcher, private gamePlayerRepository: GamePlayerRepository) {}

  async execute(input: ChangeUserModeInput): Promise<ChangeUserModeOutput> {
    const game = await this.gamePlayerRepository.findBy(input.gamePlayerId);
    if (!game) {
      return { kind: "notFound" };
    }

    const [player, event] = GamePlayer.changeUserMode(game, input.mode);
    this.gamePlayerRepository.save(player);

    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
