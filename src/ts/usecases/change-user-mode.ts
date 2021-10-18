import { GamePlayerId, UserMode } from "~/src/ts/domains/game-player";
import { GamePlayerRepository } from "~/src/ts/domains/game-player-repository";
import { EventDispatcher, UseCase } from "./base";

export interface ChangeUserModeInput {
  gamePlayerId: GamePlayerId;
  mode: UserMode;
}

export type ChangeUserModeOutput = { kind: "success" } | { kind: "notFound" } | { kind: "canNotChangeMode" };

export class ChangeUserModeUseCase implements UseCase<ChangeUserModeInput, Promise<ChangeUserModeOutput>> {
  constructor(private dispatcher: EventDispatcher, private gamePlayerRepository: GamePlayerRepository) {}

  async execute(input: ChangeUserModeInput): Promise<ChangeUserModeOutput> {
    const game = await this.gamePlayerRepository.findBy(input.gamePlayerId);
    if (!game) {
      return { kind: "notFound" };
    }

    const event = game.changeUserMode(input.mode);
    this.gamePlayerRepository.save(game);

    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
