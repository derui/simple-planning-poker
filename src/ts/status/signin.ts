import { UserId } from "@/domains/user";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import React from "react";
import { UserRepository } from "@/domains/user-repository";
import { authenticated, authenticating, currentUserState, emailToSignIn, signInState } from "./signin-atom";

export interface SigninActions {
  useSignIn: () => (email: string, callback: () => void) => void;
  useApplyAuthenticated: () => (callback: () => void) => void;

  useUpdateEmail: () => (email: string) => void;
}

export interface Authenticator {
  authenticate(email: string): Promise<UserId>;

  getAuthenticatedUser(): Promise<UserId | undefined>;
}

export const createSigninActions = (authenticator: Authenticator, userRepository: UserRepository): SigninActions => {
  return {
    useSignIn: () =>
      useRecoilCallback(({ set }) => async (email: string, callback: () => void) => {
        set(signInState, (prev) => ({ ...prev, authenticating: true }));
        try {
          const userId = await authenticator.authenticate(email);
          const user = await userRepository.findBy(userId);
          if (!user) {
            return;
          }

          set(currentUserState, () => ({ id: userId, name: email }));
          callback();
        } catch (e) {
          set(signInState, (prev) => ({ ...prev, authenticating: false }));
          throw e;
        }
      }),

    useApplyAuthenticated: () =>
      useRecoilCallback(({ set }) => async (callback: () => void) => {
        const userId = await authenticator.getAuthenticatedUser();
        if (!userId) {
          return;
        }

        const user = await userRepository.findBy(userId);
        if (!user) {
          return;
        }

        set(currentUserState, () => ({ id: userId, name: user.name }));
        callback();
      }),

    useUpdateEmail: () => {
      const setState = useSetRecoilState(signInState);
      return React.useCallback((email: string) => setState((prev) => ({ ...prev, email })), []);
    },
  };
};

export const signInSelectors = {
  useAuthenticated: () => useRecoilValue(authenticated),
  useCurrentUser: () => useRecoilValue(currentUserState),

  useSignInEmail: () => useRecoilValue(emailToSignIn),
  useAuthenticating: () => useRecoilValue(authenticating),
};
