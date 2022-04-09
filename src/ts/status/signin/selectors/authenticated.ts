import { selector } from "recoil";
import currentUserState from "../atoms/current-user";
import SelectorKeys from "./key";

const authenticated = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(currentUserState).id !== null;
  },
});

export default authenticated;
