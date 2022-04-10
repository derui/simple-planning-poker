import { useRecoilValue } from "recoil";
import authenticatedState from "./authenticated";
import authenticatingState from "./authenticating";
import joinedGamesState from "./joined-games-state";

export const useAuthenticatedState = () => {
  return useRecoilValue(authenticatedState);
};
export const useAuthenticatingState = () => {
  return useRecoilValue(authenticatingState);
};
export const useJoinedGamesState = () => {
  return useRecoilValue(joinedGamesState);
};
