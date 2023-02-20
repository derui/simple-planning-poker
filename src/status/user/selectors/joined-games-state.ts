import { selector } from "recoil";
import currentUserState from "../atoms/current-user-state";
import { UserJoinedGameViewModel } from "../types";
import SelectorKeys from "./key";

const joinedGamesState = selector<UserJoinedGameViewModel[]>({
  key: SelectorKeys.joinedGamesState,
  get: ({ get }) => {
    return get(currentUserState).joinedGames;
  },
});

export default joinedGamesState;
