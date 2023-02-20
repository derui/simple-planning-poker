import { atom } from "recoil";
import AtomKeys from "./key";
import { CurrentUserViewModel } from "../types";

const currentUserState = atom<CurrentUserViewModel>({
  key: AtomKeys.currentUserState,
  default: {
    id: null,
    name: "",
    joinedGames: [],
  },
});

export default currentUserState;
