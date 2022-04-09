import { atom } from "recoil";
import AtomKeys from "./key";

const gameCreationState = atom<{ creating: boolean }>({
  key: AtomKeys.gameCreationState,
  default: {
    creating: false,
  },
});

export default gameCreationState;
