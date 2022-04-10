import currentUserState from "@/status/signin/atoms/current-user";
import { selector } from "recoil";
import { UserJoinedGameViewModel } from "../types";
import SelectorKeys from "./key";

const joinedGamesState = selector<UserJoinedGameViewModel[]>({
  key: SelectorKeys.joinedGamesState,
  get: ({ get }) => {
    return get(currentUserState).joinedGames;
  },
});

export default joinedGamesState;
