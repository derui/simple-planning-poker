import { UserMode } from "@/domains/game-player";
import { selector, useRecoilValue } from "recoil";
import currentGamePlayerState from "../atoms/current-game-player-state";
import SelectorKeys from "./key";

type CurrentPlayerInformation = {
  name?: string;
  mode?: UserMode;
};

const internalState = selector<CurrentPlayerInformation>({
  key: SelectorKeys.currentPlayerInformation,
  get: ({ get }) => {
    const player = get(currentGamePlayerState);

    if (!player) {
      return {};
    }

    return { name: player.name, mode: player.mode };
  },
});

export default function gameCreatingState() {
  return useRecoilValue(internalState);
}
