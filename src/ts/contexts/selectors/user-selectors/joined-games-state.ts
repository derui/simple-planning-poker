import { currentUserState } from "@/status/user/signals/current-user-state";
import { createMemo } from "solid-js";

const joinedGamesState = () => createMemo(() => currentUserState().joinedGames);

export { joinedGamesState };
