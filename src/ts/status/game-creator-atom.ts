import { atom } from "recoil";
import { AtomKeys } from "./key";

export interface GameCreationState {
  name: string;
  cards: number[];
  creating: boolean;
}

export const DEFAULT_CARDS = "1,2,3,5,8,13,21,34,55,89".split(",").map((v) => Number(v));

export const gameCreationState = atom<GameCreationState>({
  key: AtomKeys.gameCreationState,
  default: {
    name: "",
    cards: DEFAULT_CARDS,
    creating: false,
  },
});
