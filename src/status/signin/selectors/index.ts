import { useRecoilValue } from "recoil";
import authenticatedState from "./authenticated-state";
import authenticatingState from "./authenticating-state";

export const useAuthenticatedState = () => {
  return useRecoilValue(authenticatedState);
};
export const useAuthenticatingState = () => {
  return useRecoilValue(authenticatingState);
};
