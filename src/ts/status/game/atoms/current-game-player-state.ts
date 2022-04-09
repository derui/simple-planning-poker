import { atom } from "recoil";
import AtomKeys from "./key";
import { GamePlayerViewModel } from "../types";

const currentGamePlayerState = atom<GamePlayerViewModel | undefined>({
  key: AtomKeys.currentGamePlayerState,
  default: undefined,
});

export default currentGamePlayerState;
