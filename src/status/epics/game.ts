import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { filter, map, from, of, switchMap, catchError, startWith, OperatorFunction, Observable } from "rxjs";
import type { RootState } from "../store";
import { noopOnEpic } from "../actions/common";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as GameAction from "@/status/actions/game";
import * as UserHand from "@/domains/user-hand";

type Epics =
  | "giveUp"
  | "handCard"
  | "changeUserMode"
  | "leaveGame"
  | "joinGame"
  | "openGame"
  | "createGame"
  | "showDown"
  | "observeOpenedGame";

const commonCatchError: OperatorFunction<any, Action> = catchError((e, source) => {
  console.error(e);

  return source.pipe(startWith(GameAction.somethingFailure("failed with exception")));
});

const observeGame = function observeGame(registrar: DependencyRegistrar<Dependencies>) {
  return switchMap((payload: GameAction.OpenedGamePayload) => {
    const gameObserver = registrar.resolve("gameObserver");

    return new Observable((subscriber) => {
      subscriber.next(noopOnEpic());

      gameObserver.subscribe(payload.game.id, (game) => {
        subscriber.next(GameAction.notifyGameChanges(game));
      });
    });
  });
};

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
  leaveGame: (action$, state$) =>
    action$.pipe(
      filter(GameAction.leaveGame.match),
      switchMap(() => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
        }

        const useCase = registrar.resolve("leaveGameUseCase");

        return from(
          useCase.execute({
            gameId: game.currentGame.id,
            userId: user.currentUser.id,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return GameAction.leaveGameSuccess();
              default:
                return GameAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),
  joinGame: (action$, state$) =>
    action$.pipe(
      filter(GameAction.joinGame.match),
      switchMap(({ payload }) => {
        const { user } = state$.value;

        if (!user.currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
        }

        const useCase = registrar.resolve("joinUserUseCase");

        return from(
          useCase.execute({
            userId: user.currentUser.id,
            signature: payload,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return GameAction.openGame(output.game.id);
              default:
                return GameAction.somethingFailure(output.kind);
            }
          })
        );
      }),
      commonCatchError
    ),

  openGame: (action$, state$) =>
    action$.pipe(
      filter(GameAction.openGame.match),
      switchMap(({ payload }) => {
        const { user } = state$.value;
        const currentUser = user.currentUser;

        if (!currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
        }

        const repository = registrar.resolve("gameRepository");
        const userRepository = registrar.resolve("userRepository");

        return from(repository.findBy(payload)).pipe(
          switchMap((game) => {
            if (!game) {
              return of([game, []] as const);
            }

            const users = userRepository.listIn(game.joinedPlayers.map((v) => v.user));

            return from(users).pipe(map((users) => [game, users] as const));
          }),
          map(([output, players]) => {
            if (!output) {
              return GameAction.openGameFailure({ reason: "Can not find game" });
            }

            if (!output.joinedPlayers.some((v) => v.user === currentUser.id)) {
              return GameAction.openGameFailure({ reason: "Current user did not join the game" });
            }

            return GameAction.openGameSuccess({ game: output, players });
          })
        );
      }),
      commonCatchError
    ),

  createGame: (action$, state$) =>
    action$.pipe(
      filter(GameAction.createGame.match),
      switchMap(({ payload }) => {
        const { user } = state$.value;
        const currentUser = user.currentUser;

        if (!currentUser) {
          return of(GameAction.somethingFailure("Can not give up with nullish"));
        }

        const useCase = registrar.resolve("createGameUseCase");

        return from(
          useCase.execute({
            name: payload.name,
            points: payload.points,
            createdBy: currentUser.id,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return GameAction.createGameSuccess(output.game);
              case "invalidStoryPoint":
                return GameAction.createGameFailure({ reason: "Story point must be greater than 0" });
              case "invalidStoryPoints":
                return GameAction.createGameFailure({ reason: "Need least 1 point to create game" });
            }
          })
        );
      }),
      commonCatchError
    ),

  showDown: (action$, state$) =>
    action$.pipe(
      filter(GameAction.showDown.match),
      switchMap(() => {
        const {
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(GameAction.somethingFailure("Can not show down with nullish"));
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
                return GameAction.showDownSuccess(output.game);
              case "notFoundGame":
                return GameAction.showDownFailed({ reason: "can not find game" });
              case "showDownFailed":
                return GameAction.showDownFailed({ reason: "failed some reason" });
            }
          })
        );
      }),
      commonCatchError
    ),
  observeOpenedGame: (action$) =>
    action$.pipe(
      filter(GameAction.openGameSuccess.match),
      map((v) => v.payload),
      observeGame(registrar),
      commonCatchError
    ),
});
