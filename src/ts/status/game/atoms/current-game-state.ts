import { atom } from "recoil";
import { GamePlayerId, UserMode } from "@/domains/game-player";
import { GameId } from "@/domains/game";
import { Card } from "@/domains/card";
import AtomKeys from "./key";

export interface UserHandViewModel {
  gamePlayerId: GamePlayerId;
  name: string;
  mode: UserMode;
  card?: Card;
  selected: boolean;
}

interface GameViewModel {
  id: GameId;
  name: string;
  hands: UserHandViewModel[];
  cards: Card[];
  showedDown: boolean;
  average: number | undefined;
  invitationSignature: string;
}

const currentGameState = atom<GameViewModel | undefined>({
  key: AtomKeys.currentGameState,
  default: undefined,
});

export default currentGameState;
