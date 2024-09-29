import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { filter, map, from, of, switchMap, catchError, startWith, OperatorFunction } from "rxjs";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as RoundAction from "@/status/actions/round";
import * as UserEstimation from "@/domains/user-estimation";
import * as Round from "@/domains/round";

type Epics =
  | "giveUp"
  | "estimate"
  | "showDown"
  | "changeTheme"
  | "openRoundHistories"
  | "nextPageOfRoundHistories"
  | "openRoundHistory";

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

  openRoundHistories: (action$, state$) =>
    action$.pipe(
      filter(
        (action) => RoundAction.openRoundHistories.match(action) || RoundAction.resetPageOfRoundHistories.match(action)
      ),
      switchMap(() => {
        const {
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure({ reason: "Do not open game" }));
        }

        const query = registrar.resolve("roundHistoryQuery");
        const promise = query.listBy(currentGame.id, { count: 10 });

        return from(promise).pipe(
          map((output) => {
            return RoundAction.openRoundHistoriesSuccess({ rounds: output.result, lastKey: output.key });
          })
        );
      }),
      commonCatchError
    ),

  nextPageOfRoundHistories: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.nextPageOfRoundHistories.match),
      switchMap(() => {
        const {
          game: { currentGame },
          finishedRounds: { lastKey },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure({ reason: "Do not open game" }));
        }

        const query = registrar.resolve("roundHistoryQuery");
        const promise = query.listBy(currentGame.id, { count: 10, lastKey });

        return from(promise).pipe(
          map((output) => {
            return RoundAction.nextPageOfRoundHistoriesSuccess({ rounds: output.result, lastKey: output.key });
          })
        );
      }),
      commonCatchError
    ),

  openRoundHistory: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.openRoundHistory.match),
      switchMap(({ payload }) => {
        const {
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure({ reason: "Do not open game" }));
        }

        const repository = registrar.resolve("roundRepository");
        const promise = repository.findFinishedRoundBy(Round.createId(payload));

        return from(promise).pipe(
          map((output) => {
            if (!output) {
              return RoundAction.somethingFailure({ reason: "Not found round" });
            }

            return RoundAction.openRoundHistorySuccess(output);
          })
        );
      }),
      commonCatchError
    ),
});
