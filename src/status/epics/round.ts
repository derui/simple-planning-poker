import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { filter, map, from, of, switchMap, catchError, startWith, OperatorFunction } from "rxjs";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as RoundAction from "@/status/actions/round";
import * as UserHand from "@/domains/user-hand";

type Epics = "giveUp" | "handCard" | "changeUserMode" | "showDown";

const commonCatchError: OperatorFunction<any, Action> = catchError((e, source) => {
  console.error(e);

  return source.pipe(startWith(RoundAction.somethingFailure("failed with exception")));
});

export const roundEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  giveUp: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.giveUp.match),
      switchMap(() => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(RoundAction.somethingFailure("Can not give up with nullish"));
        }

        const useCase = registrar.resolve("handCardUseCase");

        return from(
          useCase.execute({ gameId: game.currentGame.id, userId: user.currentUser.id, userHand: UserHand.giveUp() })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.giveUpSuccess(output.game.round);
              default:
                return RoundAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),

  handCard: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.handCard.match),
      switchMap(({ payload }) => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(RoundAction.somethingFailure("Can not give up with nullish"));
        }

        const selectedCard = game.currentGame.cards[payload.cardIndex];
        if (!selectedCard) {
          return of(RoundAction.somethingFailure("specified card not found"));
        }

        const useCase = registrar.resolve("handCardUseCase");

        return from(
          useCase.execute({
            gameId: game.currentGame.id,
            userId: user.currentUser.id,
            userHand: UserHand.handed(selectedCard),
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.handCardSuccess(output.game.round);
              default:
                return RoundAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),
  changeUserMode: (action$, state$) =>
    action$.pipe(
      filter(RoundAction.changeUserMode.match),
      switchMap(({ payload }) => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(RoundAction.somethingFailure("Can not give up with nullish"));
        }

        const useCase = registrar.resolve("changeUserModeUseCase");

        return from(
          useCase.execute({
            gameId: game.currentGame.id,
            userId: user.currentUser.id,
            mode: payload,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.changeUserModeSuccess(output.game.round);
              default:
                return RoundAction.somethingFailure(output.kind);
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
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure("Can not show down with nullish"));
        }

        const useCase = registrar.resolve("showDownUseCase");

        return from(
          useCase.execute({
            gameId: currentGame.id,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return RoundAction.showDownSuccess(output.game.round);
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
});
