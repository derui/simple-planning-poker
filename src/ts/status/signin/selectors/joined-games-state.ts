import currentUserState from "@/status/signin/atoms/current-user";
import { selector, useRecoilValue } from "recoil";
import { UserJoinedGameViewModel } from "../types";
import SelectorKeys from "./key";

const state = selector<UserJoinedGameViewModel[]>({
  key: SelectorKeys.joinedGamesState,
  get: ({ get }) => {
    return get(currentUserState).joinedGames;
  },
});

export default function joinedGamesState() {
  return useRecoilValue(state);
}
