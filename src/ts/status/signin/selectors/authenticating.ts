import { selector } from "recoil";
import signInState from "../atoms/signing";
import SelectorKeys from "./key";

const authenticatingState = selector<boolean>({
  key: SelectorKeys.authenticating,
  get: ({ get }) => {
    return get(signInState).authenticating;
  },
});

export default authenticatingState;
