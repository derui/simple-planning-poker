import { createSignal } from "solid-js";

const [gameCreationState, setGameCreationState] = createSignal<{ creating: boolean }>({ creating: false });

export { gameCreationState, setGameCreationState };
