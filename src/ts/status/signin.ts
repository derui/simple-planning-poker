import { JoinedGame, UserId } from "@/domains/user";
import { selector, useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import React from "react";
import { UserRepository } from "@/domains/user-repository";
import {
  authenticated,
  authenticating,
  currentUserState,
  emailToSignIn,
  passwordToSignIn,
  signInState,
  UserJoinedGameViewModel,
} from "./signin-atom";
import { GameRepository } from "@/domains/game-repository";
import { SelectorKeys } from "./key";

export interface SigninActions {
  useSignIn: () => (email: string, password: string, callback: () => void) => void;
  useSignUp: () => (email: string, password: string, callback: () => void) => void;
  useApplyAuthenticated: () => (callback: () => void, errorCallback?: () => void) => void;

  useUpdateEmail: () => (value: string) => void;
  useUpdatePassword: () => (value: string) => void;
}

export interface Authenticator {
  signIn(email: string, password: string): Promise<UserId>;

  signUp(name: string, email: string, password: string): Promise<UserId>;

  currentUserIdIfExists(): Promise<UserId | undefined>;
}

export const createSigninActions = (
  authenticator: Authenticator,
  userRepository: UserRepository,
  gameRepository: GameRepository
): SigninActions => {
  const getGames = async (joinedGames: JoinedGame[]) => {
    const games = await Promise.all(
      joinedGames.map(async (v) => {
        const game = await gameRepository.findBy(v.gameId);
        return game ? { game, playerId: v.playerId } : undefined;
      })
    );

    return games
      .filter((v) => !!v)
      .map((v): UserJoinedGameViewModel => {
        return { id: v!.game.id, name: v!.game.name, playerId: v!.playerId };
      });
  };

  return {
    useSignIn: () =>
      useRecoilCallback(({ set }) => async (email: string, password: string, callback: () => void) => {
        set(signInState, (prev) => ({ ...prev, authenticating: true }));
        try {
          const userId = await authenticator.signIn(email, password);
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

    useSignUp: () =>
      useRecoilCallback(({ set }) => async (email: string, password: string, callback: () => void) => {
        set(signInState, (prev) => ({ ...prev, authenticating: true }));
        try {
          const userId = await authenticator.signUp(email, email, password);
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
      useRecoilCallback(({ set }) => async (callback: () => void, errorCallback) => {
        set(signInState, (prev) => ({ ...prev, authenticating: true }));
        const userId = await authenticator.currentUserIdIfExists();

        const user = await (userId ? userRepository.findBy(userId) : Promise.resolve(undefined));
        if (!user) {
          set(signInState, (prev) => ({ ...prev, authenticating: false }));
          if (errorCallback) {
            errorCallback();
          }
          return;
        }

        const joinedGames = await getGames(user.joinedGames);
        set(signInState, (prev) => ({ ...prev, authenticating: false }));
        set(currentUserState, () => ({ id: user.id, name: user.name, joinedGames }));
        callback();
      }),

    useUpdateEmail: () => {
      const setState = useSetRecoilState(signInState);
      return React.useCallback((email: string) => setState((prev) => ({ ...prev, email })), []);
    },

    useUpdatePassword: () => {
      const setState = useSetRecoilState(signInState);
      return React.useCallback((password: string) => setState((prev) => ({ ...prev, password })), []);
    },
  };
};

const joinedGamesSelector = selector({
  key: SelectorKeys.userJoinedGames,
  get: ({ get }) => get(currentUserState).joinedGames,
});

export const signInSelectors = {
  useAuthenticated: () => useRecoilValue(authenticated),
  useCurrentUser: () => useRecoilValue(currentUserState),

  useSignInEmail: () => useRecoilValue(emailToSignIn),
  useSignInPassword: () => useRecoilValue(passwordToSignIn),
  useAuthenticating: () => useRecoilValue(authenticating),
  useJoinedGames: () => useRecoilValue(joinedGamesSelector),
};
