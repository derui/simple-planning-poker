import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as GameAction from "@/status/actions/game";
import { filter, map, from, of, switchMap, catchError, startWith, OperatorFunction } from "rxjs";
import * as UserHand from "@/domains/user-hand";

type Epics = "giveUp" | "handCard" | "changeUserMode" | "leaveGame" | "joinGame" | "openGame";

const commonCatchError: OperatorFunction<any, Action> = catchError((e, source) => {
  console.error(e);

  return source.pipe(startWith(GameAction.somethingFailure("failed with exception")));
});

export const gameEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  giveUp: (action$, state$) =>
    action$.pipe(
      filter(GameAction.giveUp.match),
      switchMap(() => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
        }

        const useCase = registrar.resolve("handCardUseCase");

        return from(
          useCase.execute({ gameId: game.currentGame.id, userId: user.currentUser.id, userHand: UserHand.giveUp() })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return GameAction.giveUpSuccess(output.game);
              default:
                return GameAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),

  handCard: (action$, state$) =>
    action$.pipe(
      filter(GameAction.handCard.match),
      switchMap(({ payload }) => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
        }

        const selectedCard = game.currentGame.cards[payload.cardIndex];
        if (!selectedCard) {
          return of(GameAction.somethingFailure("specified card not found"));
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
                return GameAction.handCardSuccess(output.game);
              default:
                return GameAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),
  changeUserMode: (action$, state$) =>
    action$.pipe(
      filter(GameAction.changeUserMode.match),
      switchMap(({ payload }) => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
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
                return GameAction.changeUserModeSuccess(output.game);
              default:
                return GameAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),
});
