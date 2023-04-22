import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { filter, map, from, of, switchMap, catchError, startWith, OperatorFunction } from "rxjs";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as RoundAction from "@/status/actions/round";
import * as UserEstimation from "@/domains/user-estimation";
import { filterUndefined } from "@/utils/basic";

type Epics = "giveUp" | "estimate" | "showDown" | "changeTheme" | "openFinishedRounds" | "changePageOfSinishedRounds";

const commonCatchError: OperatorFunction<any, Action> = catchError((e, source) => {
  console.error(e);

  return source.pipe(startWith(RoundAction.somethingFailure({ reason: "failed with exception" })));
});

export const roundEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  giveUp: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.giveUp.match),
      switchMap(() => {
        const { round, user } = state$.value;

        if (!round.instance || !user.currentUser) {
          return of(RoundAction.somethingFailure({ reason: "Can not give up" }));
        }

        const useCase = registrar.resolve("estimatePlayerUseCase");

        return from(
          useCase.execute({
            roundId: round.instance.id,
            userId: user.currentUser.id,
            userEstimation: UserEstimation.giveUp(),
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.giveUpSuccess(output.round);
              default:
                return RoundAction.somethingFailure({ reason: "Can not give up" });
            }
          })
        );
      }),
      commonCatchError
    ),

  estimate: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.estimate.match),
      switchMap(({ payload }) => {
        const { round, user } = state$.value;

        if (!round.instance || !user.currentUser) {
          return of(RoundAction.somethingFailure({ reason: "Can not estimate" }));
        }

        const selectedCard = Object.values(round.instance.cards).find((v) => v.order === payload.cardIndex)?.card;
        if (!selectedCard) {
          return of(RoundAction.somethingFailure({ reason: "Selected card is not valid" }));
        }

        const useCase = registrar.resolve("estimatePlayerUseCase");

        return from(
          useCase.execute({
            roundId: round.instance.id,
            userId: user.currentUser.id,
            userEstimation: UserEstimation.estimated(selectedCard),
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.estimateSuccess(output.round);
              default:
                return RoundAction.somethingFailure({ reason: `Can not estimate: ${output.kind}` });
            }
          })
        );
      }),
      commonCatchError
    ),

  showDown: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.showDown.match),
      switchMap(() => {
        const {
          round: { instance },
        } = state$.value;

        if (!instance) {
          return of(RoundAction.somethingFailure({ reason: "Can not show down" }));
        }

        const useCase = registrar.resolve("showDownUseCase");

        return from(
          useCase.execute({
            roundId: instance.id,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.showDownSuccess(output.round);
              case "notFoundGame":
                return RoundAction.showDownFailed({ reason: "can not find game" });
              case "showDownFailed":
                return RoundAction.showDownFailed({ reason: "failed some reason" });
            }
          })
        );
      }),
      commonCatchError
    ),

  changeTheme: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.changeTheme.match),
      switchMap(({ payload }) => {
        const {
          round: { instance },
        } = state$.value;

        if (!instance) {
          return of(RoundAction.somethingFailure({ reason: "Can not show down" }));
        }

        const useCase = registrar.resolve("changeThemeUseCase");

        return from(
          useCase.execute({
            roundId: instance.id,
            theme: payload,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.changeThemeSuccess(output.round);
              case "notFound":
                return RoundAction.somethingFailure({ reason: "can not find round" });
              case "canNotChangeTheme":
                return RoundAction.somethingFailure({ reason: "can not change theme" });
            }
          })
        );
      }),
      commonCatchError
    ),

  openFinishedRounds: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.openFinishedRounds.match),
      switchMap(() => {
        const {
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure({ reason: "Do not open game" }));
        }

        const finishedRoundsOnFirstPage = currentGame.finishedRounds.slice(0, 10);
        const repository = registrar.resolve("roundRepository");
        const promise = Promise.all(finishedRoundsOnFirstPage.map((id) => repository.findFinishedRoundBy(id)));

        return from(promise).pipe(
          map((v) => v.filter(filterUndefined)),
          map((output) => {
            return RoundAction.openFinishedRoundsSuccess(output);
          })
        );
      }),
      commonCatchError
    ),

  changePageOfSinishedRounds: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.changePageOfFinishedRounds.match),
      switchMap(({ payload }) => {
        const {
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure({ reason: "Do not open game" }));
        }

        const finishedRoundsOnFirstPage = currentGame.finishedRounds.slice((payload - 1) * 10, payload * 10);
        const repository = registrar.resolve("roundRepository");
        const promise = Promise.all(finishedRoundsOnFirstPage.map((id) => repository.findFinishedRoundBy(id)));

        return from(promise).pipe(
          map((v) => v.filter(filterUndefined)),
          map((output) => {
            return RoundAction.changePageOfFinishedRoundsSuccess({ rounds: output, page: payload });
          })
        );
      }),
      commonCatchError
    ),
});
