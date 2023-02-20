import { atom } from "recoil";
import AtomKeys from "./key";
import { GamePlayerId, UserMode } from "@/domains/game-player";

type State = {
  id: GamePlayerId;
  mode: UserMode;
};

const currentGamePlayerState = atom<State | undefined>({
  key: AtomKeys.currentGamePlayerIdState,
  default: undefined,
});

export default currentGamePlayerState;
