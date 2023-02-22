import { T } from "@/domains/card";
import { GameId } from "@/domains/game";
import { Id, UserMode } from "@/domains/game-player";
import { Id } from "@/domains/user";

export interface UserHandViewModel {
  gamePlayerId: Id;
  name: string;
  mode: UserMode;
  card?: T;
  selected: boolean;
}

export interface GamePlayerViewModel {
  id: Id;
  userId: Id;
  name: string;
  mode: UserMode;
  hand?: T;
}

export interface GameViewModel {
  id: GameId;
  name: string;
  hands: UserHandViewModel[];
  cards: T[];
  showedDown: boolean;
  average: number | undefined;
  invitationSignature: string;
}

export type GameState = {
  viewModel: GameViewModel;
  status: GameStatus;
};

export type GameStatus = "EmptyUserHand" | "CanShowDown" | "ShowedDown";

export interface ShowDownResultViewModel {
  cardCounts: [number, number][];
  average: number;
}
