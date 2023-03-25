import { EventDispatcher, UseCase } from "./base";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import { GameRepository } from "@/domains/game-repository";

export interface KickPlayerUserCaseInput {
  gameId: Game.Id;
  requestedUserId: User.Id;
  targetUserId: User.Id;
}

export type KickPlayerUseCaseOutput =
  | {
      kind: "success";
      game: Game.T;
    }
  | { kind: "notFoundGame" }
  | { kind: "canNotKickByPlayer" }
  | { kind: "kickFailed" };

export class KickPlayerUseCase implements UseCase<KickPlayerUserCaseInput, Promise<KickPlayerUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: KickPlayerUserCaseInput): Promise<KickPlayerUseCaseOutput> {
    const game = await this.gameRepository.findBy(input.gameId);
    if (!game) {
      return { kind: "notFoundGame" };
    }

    if (input.requestedUserId !== game.owner) {
      return { kind: "canNotKickByPlayer" };
    }

    try {
      const [newGame, event] = Game.acceptLeaveFrom(game, input.targetUserId);
      if (!event) {
        return { kind: "kickFailed" };
      }

      await this.gameRepository.save(newGame);

      this.dispatcher.dispatch(event);

      return { kind: "success", game: newGame };
    } catch (e) {
      console.error(e);
      return { kind: "kickFailed" };
    }
  }
}
