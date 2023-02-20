import { useRecoilValue } from "recoil";
import currentUserNameState from "./current-user-name-state";
import joinedGamesState from "./joined-games-state";

export const useJoinedGamesState = () => {
  return useRecoilValue(joinedGamesState);
};
export const useCurrentUserNameState = () => {
  return useRecoilValue(currentUserNameState);
};
