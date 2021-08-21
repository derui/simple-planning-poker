import { UserId } from "@/domains/user";
import { AtomKeys, SelectorKeys } from "./key";
import { atom, selector, useRecoilCallback, useRecoilValue } from "recoil";

export interface SigninActions {
  useSignIn: () => (email: string) => void;

  useAuthenticated: () => boolean;
}

export interface Authenticator {
  authenticate(email: string): Promise<UserId>;
}

type CurrentUser = {
  id: UserId | null;
  name: string;
};

const currentUser = atom<CurrentUser>({
  key: AtomKeys.currentUserId,
  default: {
    id: null,
    name: "",
  },
});

const authenticated = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(currentUser).id !== null;
  },
});

export const createSigninActions = (authenticator: Authenticator): SigninActions => {
  return {
    useSignIn: () =>
      useRecoilCallback(({ set }) => async (email: string) => {
        const userId = await authenticator.authenticate(email);

        set(currentUser, () => ({ id: userId, name: email }));
      }),

    useAuthenticated: () => useRecoilValue(authenticated),
  };
};
