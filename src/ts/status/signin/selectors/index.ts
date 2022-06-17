import { authenticatedState } from "./authenticated-state";
import { authenticatingState } from "./authenticating-state";

export const useAuthenticatedState = () => {
  return authenticatedState();
};
export const useAuthenticatingState = () => {
  return authenticatingState();
};
