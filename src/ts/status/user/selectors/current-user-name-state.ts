import { selector } from "recoil";
import currentUserState from "../atoms/current-user-state";
import SelectorKeys from "./key";

const currentUserNameState = selector<string>({
  key: SelectorKeys.currentUserNameState,
  get: ({ get }) => {
    return get(currentUserState).name;
  },
});

export default currentUserNameState;
