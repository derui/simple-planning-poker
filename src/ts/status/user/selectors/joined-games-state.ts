import { createMemo } from "solid-js";
import { currentUserState } from "../signals/current-user-state";

const joinedGamesState = createMemo(() => currentUserState().joinedGames);

export { joinedGamesState };
