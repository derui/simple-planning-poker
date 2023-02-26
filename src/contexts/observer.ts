import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import { createContext } from "react";

export interface GameObserver {
  subscribe(gameId: Game.Id, subscriber: (game: Game.T) => void): void;

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

export interface UserObserver {
  subscribe(id: User.Id, subscriber: (user: User.T) => void): () => void;
}
