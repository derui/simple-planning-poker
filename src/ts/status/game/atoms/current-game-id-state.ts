import { GameId } from "@/domains/game";
import { createSignal } from "solid-js";

const [currentGameIdState, setCurrentGameIdState] = createSignal<GameId | undefined>(undefined);

export { currentGameIdState, setCurrentGameIdState };
