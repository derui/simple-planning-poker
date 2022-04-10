import { atom } from "recoil";
import { UserId } from "@/domains/user";
import AtomKeys from "./key";
import { UserJoinedGameViewModel } from "../types";

type CurrentUserViewModel = {
  id: UserId | null;
  name: string;
  joinedGames: UserJoinedGameViewModel[];
};

const currentUserState = atom<CurrentUserViewModel>({
  key: AtomKeys.currentUser,
  default: {
    id: null,
    name: "",
    joinedGames: [],
  },
});

export default currentUserState;
