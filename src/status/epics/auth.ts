import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { catchError, filter, from, map, of, startWith, switchMap } from "rxjs";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as SignIn from "@/status/actions/signin";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";

type Epics = "tryAuthenticate" | "signIn" | "signUp";

const getAuthenticationSuccess = function getAuthenticationSuccess(registrar: DependencyRegistrar<Dependencies>) {
  return switchMap((user: User.T | undefined) => {
    if (!user) {
      return of(undefined);
    }
    const gameRepository = registrar.resolve("gameRepository");

    return from(gameRepository.listUserJoined(user.id)).pipe(
      map((games) =>
        games.reduce<Record<Game.Id, string>>((accum, game) => {
          accum[game.id] = game.name;
          return accum;
        }, {})
      ),
      map((games) => {
        return { user, games };
      })
    );
  });
};

const getUser = function getUser(registrar: DependencyRegistrar<Dependencies>) {
  return switchMap((ret: User.Id | undefined) => {
    if (!ret) {
      return of(undefined);
    }

    const repository = registrar.resolve("userRepository");

    return from(repository.findBy(ret));
  });
};

export const authEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  tryAuthenticate: (action$, state$) =>
    action$.pipe(
      filter(SignIn.tryAuthenticate.match),
      switchMap(() => {
        const { user } = state$.value;
        if (user.currentUser) {
          return of(undefined);
        }

        const authenticator = registrar.resolve("authenticator");

        return from(authenticator.currentUserIdIfExists());
      }),
      getUser(registrar),
      getAuthenticationSuccess(registrar),
      map((ret: { user: User.T; games: Record<Game.Id, string> } | undefined) => {
        if (!ret) {
          return SignIn.tryAuthenticateFailure();
        }

        return SignIn.tryAuthenticateSuccess({ user: ret.user, joinedGames: ret.games });
      }),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.tryAuthenticateFailure()));
      })
    ),

  signIn: (action$) =>
    action$.pipe(
      filter(SignIn.signIn.match),
      switchMap(({ payload }) => {
        const authenticator = registrar.resolve("authenticator");

        return from(authenticator.signIn(payload.email, payload.password));
      }),
      getUser(registrar),
      getAuthenticationSuccess(registrar),
      map((ret) => {
        if (!ret) {
          return SignIn.signInFailure();
        }

        return SignIn.signInSuccess({ user: ret.user, joinedGames: ret.games });
      }),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.signInFailure()));
      })
    ),
  signUp: (action$) =>
    action$.pipe(
      filter(SignIn.signUp.match),
      switchMap(({ payload }) => {
        const authenticator = registrar.resolve("authenticator");

        return from(authenticator.signUp(payload.email, payload.email, payload.password));
      }),
      getUser(registrar),
      getAuthenticationSuccess(registrar),
      map((ret) => {
        if (!ret) {
          return SignIn.signUpFailure();
        }

        return SignIn.signUpSuccess({ user: ret.user, joinedGames: ret.games });
      }),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.signUpFailure()));
      })
    ),
});
