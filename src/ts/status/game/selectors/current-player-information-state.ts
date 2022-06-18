import { UserMode } from "@/domains/game-player";
import { currentUserState } from "@/status/user/atoms/current-user-state";
import { createMemo } from "solid-js";
import { currentGamePlayerState } from "../atoms/current-game-player-state";

type CurrentPlayerInformation = {
  name?: string;
  mode?: UserMode;
};

const currentPlayerInformationState = createMemo<CurrentPlayerInformation>(() => {
  const player = currentGamePlayerState();
  const user = currentUserState();

  if (!player || !user) {
    return {};
  }

  return { name: user.name, mode: player.mode };
});

export { currentPlayerInformationState };
