import { selector } from "recoil";
import signInState from "../atoms/signin-state";
import SelectorKeys from "./key";

const authenticatedState = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(signInState).authenticated;
  },
});

export default authenticatedState;
