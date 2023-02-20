import { UserMode } from "@/domains/game-player";
import currentUserState from "@/status/user/atoms/current-user-state";
import { selector } from "recoil";
import currentGamePlayerState from "../atoms/current-game-player-state";
import SelectorKeys from "./key";

type CurrentPlayerInformation = {
  name?: string;
  mode?: UserMode;
};

const currentPlayerInformationState = selector<CurrentPlayerInformation>({
  key: SelectorKeys.currentPlayerInformation,
  get: ({ get }) => {
    const player = get(currentGamePlayerState);
    const user = get(currentUserState);

    if (!player || !user) {
      return {};
    }

    return { name: user.name, mode: player.mode };
  },
});

export default currentPlayerInformationState;
