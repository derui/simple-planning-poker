import { atom } from "recoil";
import AtomKeys from "./key";
import { GameId } from "@/domains/game";

const currentGameIdState = atom<GameId | undefined>({
  key: AtomKeys.currentGameStateId,
  default: undefined,
});

export default currentGameIdState;
