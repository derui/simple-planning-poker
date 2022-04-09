import { selector } from "recoil";
import currentUserState from "../atoms/current-user";
import SelectorKeys from "./key";

const authenticatedSelector = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(currentUserState).id !== null;
  },
});

export default authenticatedSelector;
