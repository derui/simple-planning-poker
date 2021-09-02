import { GameId } from "@/domains/game";
import { UserMode } from "@/domains/game-joined-user";
import { GameRepository } from "@/domains/game-repository";
import { UserId } from "@/domains/user";
import { EventDispatcher, UseCase } from "./base";

export interface ChangeUserModeInput {
  gameId: GameId;
  userId: UserId;
  mode: UserMode;
}

export type ChangeUserModeOutput = { kind: "success" } | { kind: "notFound" } | { kind: "canNotChangeMode" };

export class ChangeUserModeUseCase implements UseCase<ChangeUserModeInput, Promise<ChangeUserModeOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: ChangeUserModeInput): Promise<ChangeUserModeOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFound" };
    }

    if (!game.canChangeUserMode(input.userId)) {
      return { kind: "canNotChangeMode" };
    }

    const event = game.changeUserMode(input.userId, input.mode);
    this.gameRepository.save(game);

    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
