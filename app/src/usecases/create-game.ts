import { EventDispatcher, UseCase } from "./base";
import * as Game from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";

export interface CreateGameUseCaseInput {
  name: string;
  points: number[];
  createdBy: User.Id;
}

export type CreateGameUseCaseOutput =
  | { kind: "success"; game: Game.T }
  | { kind: "invalidStoryPoint" }
  | { kind: "invalidStoryPoints" };

export class CreateGameUseCase implements UseCase<CreateGameUseCaseInput, Promise<CreateGameUseCaseOutput>> {
  constructor(
    private dispatcher: EventDispatcher,
    private gameRepository: GameRepository
  ) {}

  async execute(input: CreateGameUseCaseInput): Promise<CreateGameUseCaseOutput> {
    if (!input.points.every(StoryPoint.isValid)) {
      return { kind: "invalidStoryPoint" };
    }

    const storyPoints = input.points.map(StoryPoint.create);

    if (!SelectableCards.isValidStoryPoints(storyPoints)) {
      return { kind: "invalidStoryPoints" };
    }

    const selectableCards = SelectableCards.create(storyPoints);

    const gameId = Game.createId();
    const roundId = Round.createId();
    const [game, event] = Game.create({
      id: gameId,
      name: input.name,
      owner: input.createdBy,
      cards: selectableCards,
      round: roundId,
    });

    await this.gameRepository.save(game);
    this.dispatcher.dispatch(event);

    return { kind: "success", game };
  }
}
