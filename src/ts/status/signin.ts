import { UserId } from "@/domains/user";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import React from "react";
import { UserRepository } from "@/domains/user-repository";
import {
  authenticated,
  authenticating,
  currentUserState,
  emailToSignIn,
  signInState,
  UserJoinedGameViewModel,
} from "./signin-atom";
import { GameRepository } from "@/domains/game-repository";
import { GameId } from "@/domains/game";

export interface SigninActions {
  useSignIn: () => (email: string, callback: () => void) => void;
  useApplyAuthenticated: () => (callback: () => void) => void;

  useUpdateEmail: () => (email: string) => void;
}

export interface Authenticator {
  authenticate(email: string): Promise<UserId>;

  getAuthenticatedUser(): Promise<UserId | undefined>;
}

export const createSigninActions = (
  authenticator: Authenticator,
  userRepository: UserRepository,
  gameRepository: GameRepository
): SigninActions => {
  const getGames = async (gameIds: GameId[]) => {
    const games = await Promise.all(gameIds.map(gameRepository.findBy));
    return games
      .filter((v) => !!v)
      .map((v): UserJoinedGameViewModel => {
        return { id: v!.id, name: v!.name };
      });
  };

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

          const joinedGames = await getGames(user.joinedGames);
          set(currentUserState, () => ({ id: userId, name: email, joinedGames }));
          callback();
        } catch (e) {
          throw e;
        } finally {
          set(signInState, (prev) => ({ ...prev, authenticating: false }));
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

        const joinedGames = await getGames(user.joinedGames);
        set(currentUserState, () => ({ id: userId, name: user.name, joinedGames }));
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
