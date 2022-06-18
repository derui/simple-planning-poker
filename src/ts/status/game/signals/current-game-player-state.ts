import { GamePlayerId, UserMode } from "@/domains/game-player";
import { createSignal } from "solid-js";

type State = {
  id: GamePlayerId;
  mode: UserMode;
};

const [currentGamePlayerState, setCurrentGamePlayerState] = createSignal<State | undefined>(undefined);

export { currentGamePlayerState, setCurrentGamePlayerState };
