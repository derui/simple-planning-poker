import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { catchError, filter, from, map, Observable, of, OperatorFunction, startWith, switchMap } from "rxjs";
import type { RootState } from "../store";
import { notifyJoinedGames, notifyOtherUserChanged } from "../actions/user";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as SignIn from "@/status/actions/signin";
import * as Game from "@/domains/game";
import * as User from "@/domains/user";
import { JoinedGameState } from "@/domains/game-repository";

type Epics =
  | "tryAuthenticate"
  | "signIn"
  | "signUp"
  | "observeUserAfterSignIn"
  | "observeUserAfterTryAuthenticate"
  | "observeUserAfterSignUp";

const getAuthenticationSuccess = function getAuthenticationSuccess(registrar: DependencyRegistrar<Dependencies>) {
  return switchMap((user: User.T | undefined) => {
    if (!user) {
      return of(undefined);
    }
    const gameRepository = registrar.resolve("gameRepository");

    return from(gameRepository.listUserJoined(user.id)).pipe(
      map((games) =>
        games.reduce<Record<Game.Id, { name: string; state: JoinedGameState }>>((accum, game) => {
          accum[game.id] = { name: game.name, state: game.state };
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

const observeUser = function observeUser(
  registrar: DependencyRegistrar<Dependencies>
): OperatorFunction<SignIn.AuthenticationSuccess, Action> {
  return switchMap((payload: SignIn.AuthenticationSuccess) => {
    const observer = registrar.resolve("userObserver");

    return new Observable<Action>((subscriber) => {
      observer.subscribe(payload.user.id, (user, joinedGames) => {
        subscriber.next(notifyOtherUserChanged(user));
        subscriber.next(notifyJoinedGames({ user: user.id, games: joinedGames }));
      });
    });
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
      map((ret) => {
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
  observeUserAfterSignUp: (action$) =>
    action$.pipe(
      filter(SignIn.signUpSuccess.match),
      map(({ payload }) => payload),
      observeUser(registrar),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.observingFailure()));
      })
    ),
  observeUserAfterTryAuthenticate: (action$) =>
    action$.pipe(
      filter(SignIn.tryAuthenticateSuccess.match),
      map(({ payload }) => payload),
      observeUser(registrar),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.observingFailure()));
      })
    ),
  observeUserAfterSignIn: (action$) =>
    action$.pipe(
      filter(SignIn.signInSuccess.match),
      map(({ payload }) => payload),
      observeUser(registrar),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.observingFailure()));
      })
    ),
});
