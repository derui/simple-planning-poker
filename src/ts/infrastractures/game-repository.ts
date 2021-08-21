import { Game, GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";

export class GameRepositoryImpl implements GameRepository {
  private games: Game[] = [];
  constructor() {}

  save(game: Game): void {
    this.games = this.games.filter((v) => v.id !== game.id).concat(game);
  }

  findBy(id: GameId): Game | undefined {
    return this.games.find((v) => v.id === id);
  }
}
