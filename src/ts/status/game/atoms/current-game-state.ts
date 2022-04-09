import { atom } from "recoil";
import AtomKeys from "./key";
import { GameViewModel } from "../types";

const currentGameState = atom<GameViewModel | undefined>({
  key: AtomKeys.currentGameState,
  default: undefined,
});

export default currentGameState;
