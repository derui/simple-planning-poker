import { atom } from "recoil";
import AtomKeys from "./key";
import { Id } from "@/domains/game";

const currentGameIdState = atom<Id | undefined>({
  key: AtomKeys.currentGameStateId,
  default: undefined,
});

export default currentGameIdState;
