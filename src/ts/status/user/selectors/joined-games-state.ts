import { createMemo } from "solid-js";
import { currentUserState } from "../atoms/current-user-state";

const joinedGamesState = createMemo(() => currentUserState().joinedGames);

export { joinedGamesState };
