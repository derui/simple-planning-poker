import { UserMode } from "@/domains/game-player";
import { currentGamePlayerState } from "@/status/game/signals/current-game-player-state";
import { currentUserState } from "@/status/user/signals/current-user-state";
import { createMemo } from "solid-js";

type CurrentPlayerInformation = {
  name?: string;
  mode?: UserMode;
};

const currentPlayerInformationState = () =>
  createMemo<CurrentPlayerInformation>(() => {
    const player = currentGamePlayerState();
    const user = currentUserState();

    if (!player || !user) {
      return {};
    }

    return { name: user.name, mode: player.mode };
  });

export { currentPlayerInformationState };
