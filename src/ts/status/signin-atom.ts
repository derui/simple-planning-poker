import { AtomKeys, SelectorKeys } from "./key";
import { atom, selector } from "recoil";
import { UserId } from "@/domains/user";

export interface UserJoinedGameViewModel {
  id: string;
  name: string;
  playerId: string;
}

export type CurrentUserViewModel = {
  id: UserId | null;
  name: string;
  joinedGames: UserJoinedGameViewModel[];
};

export const currentUserState = atom<CurrentUserViewModel>({
  key: AtomKeys.currentUserId,
  default: {
    id: null,
    name: "",
    joinedGames: [],
  },
});

export const signInState = atom<{ password: string; email: string; authenticating: boolean }>({
  key: AtomKeys.signInState,
  default: {
    email: "",
    password: "",
    authenticating: false,
  },
});

export const authenticated = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(currentUserState).id !== null;
  },
});

export const emailToSignIn = selector<string>({
  key: SelectorKeys.emailToSignIn,
  get: ({ get }) => {
    return get(signInState).email;
  },
});

export const passwordToSignIn = selector<string>({
  key: SelectorKeys.passwordToSignIn,
  get: ({ get }) => {
    return get(signInState).password;
  },
});

export const authenticating = selector<boolean>({
  key: SelectorKeys.authenticating,
  get: ({ get }) => {
    return get(signInState).authenticating;
  },
});
