import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { catchError, filter, from, map, of, startWith, switchMap } from "rxjs";
import * as SignIn from "@/status/actions/signin";

type Epics = "tryAuthenticate" | "signIn" | "signUp";

export const authEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  tryAuthenticate: (action$, state$) =>
    action$.pipe(
      filter(SignIn.tryAuthenticate.match),
      switchMap(() => {
        const { user } = state$.value;
        if (user.currentUser) {
          return of(SignIn.tryAuthenticateFailure());
        }

        const authenticator = registrar.resolve("authenticator");

        return from(authenticator.currentUserIdIfExists()).pipe(
          switchMap((ret) => {
            if (!ret) {
              return of(SignIn.tryAuthenticateFailure());
            }

            const repository = registrar.resolve("userRepository");

            return from(repository.findBy(ret)).pipe(
              map((user) => {
                if (!user) {
                  return SignIn.tryAuthenticateFailure();
                }

                return SignIn.tryAuthenticateSuccess(user);
              })
            );
          })
        );
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

        return from(authenticator.signIn(payload.email, payload.password)).pipe(
          switchMap((ret) => {
            if (!ret) {
              return of(SignIn.signInFailure());
            }

            const repository = registrar.resolve("userRepository");

            return from(repository.findBy(ret)).pipe(
              map((user) => {
                if (!user) {
                  return SignIn.signInFailure();
                }

                return SignIn.signInSuccess(user);
              })
            );
          })
        );
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

        return from(authenticator.signUp(payload.email, payload.email, payload.password)).pipe(
          switchMap((ret) => {
            if (!ret) {
              return of(SignIn.signUpFailure());
            }

            const repository = registrar.resolve("userRepository");

            return from(repository.findBy(ret)).pipe(
              map((user) => {
                if (!user) {
                  return SignIn.signUpFailure();
                }

                return SignIn.signUpSuccess(user);
              })
            );
          })
        );
      }),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(SignIn.signUpFailure()));
      })
    ),
});
