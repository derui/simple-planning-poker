import { Game, GameId } from "@/domains/game";
import { createContext } from "react";

export interface GameObserver {
  subscribe(gameId: GameId, subscriber: (game: Game) => void): void;

  unsubscribe(): void;
}

class DummyGameObserver implements GameObserver {
  subscribe(): void {
    throw new Error("Method not implemented.");
  }
  unsubscribe(): void {
    throw new Error("Method not implemented.");
  }
}

export const gameObserverContext = createContext<GameObserver>(new DummyGameObserver());
