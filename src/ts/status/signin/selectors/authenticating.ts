import { selector, useRecoilValue } from "recoil";
import signInState from "../atoms/signing";
import SelectorKeys from "./key";

const state = selector<boolean>({
  key: SelectorKeys.authenticating,
  get: ({ get }) => {
    return get(signInState).authenticating;
  },
});

export default function authenticatingState() {
  return useRecoilValue(state);
}
