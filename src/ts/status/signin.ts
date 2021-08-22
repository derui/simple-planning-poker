import { UserId } from "@/domains/user";
import { AtomKeys, SelectorKeys } from "./key";
import { atom, selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import React from "react";

export interface SigninActions {
  useSignIn: () => (email: string, callback: () => void) => void;

  useUpdateEmail: () => (email: string) => void;
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

const signInState = atom<{ email: string; authenticating: boolean }>({
  key: AtomKeys.signInState,
  default: {
    email: "",
    authenticating: false,
  },
});

const authenticated = selector<boolean>({
  key: SelectorKeys.authenticated,
  get: ({ get }) => {
    return get(currentUser).id !== null;
  },
});

const emailToSignIn = selector<string>({
  key: SelectorKeys.emailToSignIn,
  get: ({ get }) => {
    return get(signInState).email;
  },
});

const authenticating = selector<boolean>({
  key: SelectorKeys.authenticating,
  get: ({ get }) => {
    return get(signInState).authenticating;
  },
});

export const createSigninActions = (authenticator: Authenticator): SigninActions => {
  return {
    useSignIn: () =>
      useRecoilCallback(({ set }) => async (email: string, callback: () => void) => {
        set(signInState, (prev) => ({ ...prev, authenticating: true }));
        try {
          const userId = await authenticator.authenticate(email);

          set(currentUser, () => ({ id: userId, name: email }));
          callback();
        } catch (e) {
          set(signInState, (prev) => ({ ...prev, authenticating: false }));
          throw e;
        }
      }),

    useUpdateEmail: () => {
      const setState = useSetRecoilState(signInState);
      return React.useCallback((email: string) => setState((prev) => ({ ...prev, email })), []);
    },
  };
};

export const signInSelectors = {
  useAuthenticated: () => useRecoilValue(authenticated),
  useCurrentUser: () => useRecoilValue(currentUser),

  useSignInEmail: () => useRecoilValue(emailToSignIn),
  useAuthenticating: () => useRecoilValue(authenticating),
};
