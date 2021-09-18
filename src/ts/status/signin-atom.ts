import { AtomKeys, SelectorKeys } from "./key";
import { atom, selector } from "recoil";
import { UserId } from "@/domains/user";

export type CurrentUserViewModel = {
  id: UserId | null;
  name: string;
};

export const currentUserState = atom<CurrentUserViewModel>({
  key: AtomKeys.currentUserId,
  default: {
    id: null,
    name: "",
  },
});

export const signInState = atom<{ email: string; authenticating: boolean }>({
  key: AtomKeys.signInState,
  default: {
    email: "",
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

export const authenticating = selector<boolean>({
  key: SelectorKeys.authenticating,
  get: ({ get }) => {
    return get(signInState).authenticating;
  },
});
