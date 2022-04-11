import { Card } from "@/domains/card";
import { GameId } from "@/domains/game";
import { GamePlayerId, UserMode } from "@/domains/game-player";
import { UserId } from "@/domains/user";

export interface UserHandViewModel {
  gamePlayerId: GamePlayerId;
  name: string;
  mode: UserMode;
  card?: Card;
  selected: boolean;
}

export interface GamePlayerViewModel {
  id: GamePlayerId;
  userId: UserId;
  name: string;
  mode: UserMode;
  hand?: Card;
}

export interface GameViewModel {
  id: GameId;
  name: string;
  hands: UserHandViewModel[];
  cards: Card[];
  showedDown: boolean;
  average: number | undefined;
  invitationSignature: string;
}

export type GameState =
  | {
      kind: "loaded";
      viewModel: GameViewModel;
      status: GameStatus;
    }
  | {
      kind: "pending";
    }
  | {
      kind: "notSelected";
    };

export type GameStatus = "EmptyUserHand" | "CanShowDown" | "ShowedDown";

export interface ShowDownResultViewModel {
  cardCounts: [number, number][];
  average: number;
}
