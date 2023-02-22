import { atom } from "recoil";
import AtomKeys from "./key";
import { Id, UserMode } from "@/domains/game-player";

type State = {
  id: Id;
  mode: UserMode;
};

const currentGamePlayerState = atom<State | undefined>({
  key: AtomKeys.currentGamePlayerIdState,
  default: undefined,
});

export default currentGamePlayerState;
