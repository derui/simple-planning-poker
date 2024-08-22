import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { filter, map, switchMap, catchError, startWith, from, of } from "rxjs";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { changeName, changeNameFailure, changeNameSuccess } from "@/status/actions/user";

type Epics = "changeUserName";

export const userEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  changeUserName: (action$, state$) =>
    action$.pipe(
      filter(changeName.match),
      switchMap(({ payload }) => {
        const useCase = registrar.resolve("changeUserNameUseCase");
        const state = state$.value;

        if (!state.user.currentUser) {
          return of(changeNameFailure({ reason: "Can not change user name" }));
        }

        return from(useCase.execute({ name: payload, userId: state.user.currentUser.id })).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return changeNameSuccess(output.user);
              default:
                console.warn(`failed with ${output.kind}`);

                return changeNameFailure({ reason: `Can not change user name` });
            }
          })
        );
      }),
      catchError((e, source) => {
        console.error(e);

        return source.pipe(startWith(changeNameFailure({ reason: "Failed to change user name" })));
      })
    ),
});
