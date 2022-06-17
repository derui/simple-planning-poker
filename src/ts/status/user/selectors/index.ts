import currentUserNameState from "./current-user-name-state";
import joinedGamesState from "./joined-games-state";

export const useJoinedGamesState = () => {
  return joinedGamesState();
};
export const useCurrentUserNameState = () => {
  return currentUserNameState();
};
