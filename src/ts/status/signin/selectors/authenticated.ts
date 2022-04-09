import { selector, useRecoilValue } from "recoil";
import currentUserState from "../atoms/current-user";
import SelectorKeys from "./key";

const state = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(currentUserState).id !== null;
  },
});

export default function authenticatedState() {
  return useRecoilValue(state);
}
