import { UserMode } from "@/domains/game-player";
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

    if (!player) {
      return {};
    }

    return { name: player.name, mode: player.mode };
  },
});

export default currentPlayerInformationState;
