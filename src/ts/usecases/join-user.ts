import { GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import { createUser, UserId } from "@/domains/user";
import { EventDispatcher, UseCase } from "./base";

export interface JoinUserUseCaseInput {
  gameId: GameId;
  userId: UserId;
  name: string;
}

export type JoinUserUseCaseOutput = { kind: "success" } | { kind: "notFoundGame" };

export class JoinUserUseCase implements UseCase<JoinUserUseCaseInput, Promise<JoinUserUseCaseOutput>> {
  constructor(private dispatcher: EventDispatcher, private gameRepository: GameRepository) {}

  async execute(input: JoinUserUseCaseInput): Promise<JoinUserUseCaseOutput> {
    const user = createUser({
      id: input.userId,
      name: input.name,
    });
    const game = await this.gameRepository.findBy(input.gameId);

    if (!game) {
      return { kind: "notFoundGame" };
    }

    const event = game.acceptToBeJoinedBy(user);

    if (event) {
      this.dispatcher.dispatch(event);
    }

    return { kind: "success" };
  }
}
