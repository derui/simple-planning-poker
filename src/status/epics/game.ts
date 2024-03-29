import { Epic } from "redux-observable";
import type { Action } from "@reduxjs/toolkit";
import { filter, map, from, of, switchMap, catchError, startWith, OperatorFunction, Observable } from "rxjs";
import type { RootState } from "../store";
import type { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import * as GameAction from "@/status/actions/game";
import * as RoundAction from "@/status/actions/round";
import * as UserAction from "@/status/actions/user";

type Epics =
  | "leaveGame"
  | "joinGame"
  | "openGame"
  | "createGame"
  | "observeOpenedGame"
  | "changeUserMode"
  | "newRound"
  | "kickPlayer";

const commonCatchError: OperatorFunction<any, Action> = catchError((e, source) => {
  console.error(e);

  return source.pipe(startWith(GameAction.somethingFailure({ reason: "failed with exception" })));
});

const observeGame = function observeGame(registrar: DependencyRegistrar<Dependencies>) {
  return switchMap((payload: GameAction.OpenedGamePayload) => {
    const gameObserver = registrar.resolve("gameObserver");
    const userObserver = registrar.resolve("userObserver");
    const roundObserver = registrar.resolve("roundObserver");

    return new Observable((subscriber) => {
      userObserver.unsubscribe();

      gameObserver.subscribe(payload.game.id, (game) => {
        game.joinedPlayers.forEach((_user) => {
          userObserver.subscribe(_user.user, (user, games) => {
            subscriber.next(UserAction.notifyOtherUserChanged(user));
            subscriber.next(UserAction.notifyJoinedGames({ user: user.id, games }));
          });
        });

        roundObserver.subscribe(game.round, (round) => {
          subscriber.next(RoundAction.notifyRoundUpdated(round));
        });

        subscriber.next(GameAction.notifyGameChanges(game));
      });

      payload.game.joinedPlayers.forEach((_user) => {
        userObserver.subscribe(_user.user, (user, games) => {
          subscriber.next(UserAction.notifyOtherUserChanged(user));
          subscriber.next(UserAction.notifyJoinedGames({ user: user.id, games }));
        });
      });

      roundObserver.subscribe(payload.game.round, (round) => {
        subscriber.next(RoundAction.notifyRoundUpdated(round));
      });
    });
  });
};

export const gameEpic = (
  registrar: DependencyRegistrar<Dependencies>
): Record<Epics, Epic<Action, Action, RootState>> => ({
  leaveGame: (action$, state$) =>
    action$.pipe(
      filter(GameAction.leaveGame.match),
      switchMap(() => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(GameAction.somethingFailure({ reason: "Can not give up with nullish" }));
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
                return GameAction.somethingFailure({ reason: `Can not leave game: ${output.kind}` });
            }
          })
        );
      }),
      commonCatchError
    ),
  kickPlayer: (action$, state$) =>
    action$.pipe(
      filter(GameAction.kickPlayer.match),
      switchMap((action) => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(GameAction.somethingFailure({ reason: "Can not kick player without game" }));
        }

        const useCase = registrar.resolve("kickPlayerUseCase");

        return from(
          useCase.execute({
            gameId: game.currentGame.id,
            requestedUserId: user.currentUser.id,
            targetUserId: action.payload,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return GameAction.kickPlayerSuccess();
              default:
                return GameAction.somethingFailure({ reason: `Can not kick user: ${output.kind}` });
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
          return of(GameAction.somethingFailure({ reason: "Can not join" }));
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
                return GameAction.somethingFailure({ reason: `Can not join game: ${output.kind}` });
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
          return of(GameAction.somethingFailure({ reason: "Can not open game" }));
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
          return of(GameAction.somethingFailure({ reason: "Can not create game" }));
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

  changeUserMode: (action$, state$) =>
    action$.pipe(
      filter(GameAction.changeUserMode.match),
      switchMap(({ payload }) => {
        const { game, user } = state$.value;

        if (!game.currentGame || !user.currentUser) {
          return of(RoundAction.somethingFailure({ reason: "Can not change user mode" }));
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
                return GameAction.somethingFailure({ reason: `Can not change user mode: ${output.kind}` });
            }
          })
        );
      }),
      commonCatchError
    ),
  newRound: (action$, state$) =>
    action$.pipe(
      filter(GameAction.newRound.match),
      switchMap(() => {
        const {
          game: { currentGame },
        } = state$.value;

        if (!currentGame) {
          return of(RoundAction.somethingFailure({ reason: "Can not make new round" }));
        }

        const useCase = registrar.resolve("newRoundUseCase");

        return from(
          useCase.execute({
            gameId: currentGame.id,
          })
        ).pipe(
          map((output) => {
            switch (output.kind) {
              case "success":
                return GameAction.newRoundSuccess(output.round);
              case "notFound":
                return GameAction.newRoundFailure({ reason: "can not find game" });
              case "canNotStartNewRound":
                return GameAction.newRoundFailure({ reason: "can not start new round" });
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
