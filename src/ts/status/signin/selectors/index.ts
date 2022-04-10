import { useRecoilValue } from "recoil";
import authenticatedState from "./authenticated";
import authenticatingState from "./authenticating";

export const useAuthenticatedState = () => {
  return useRecoilValue(authenticatedState);
};
export const useAuthenticatingState = () => {
  return useRecoilValue(authenticatingState);
};
