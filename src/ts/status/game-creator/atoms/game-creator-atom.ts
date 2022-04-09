import { atom } from "recoil";
import AtomKeys from "./key";

interface GameCreationState {
  name: string;
  cards: number[];
  creating: boolean;
}

const DEFAULT_CARDS = "0,1,2,3,5,8,13,21,34,55,89".split(",").map((v) => Number(v));

const gameCreationState = atom<GameCreationState>({
  key: AtomKeys.gameCreationState,
  default: {
    name: "",
    cards: DEFAULT_CARDS,
    creating: false,
  },
});

export default gameCreationState;
