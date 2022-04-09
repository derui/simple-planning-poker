import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import {
  gameCreationActionContext,
  gameActionContext,
  gameSelectorContext,
  userActionsContext,
} from "./contexts/actions";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { createGameCreationActions } from "./status/game-creator";
import { EventDispatcherImpl } from "./infrastractures/event/event-dispatcher";
import { GameCreatedEventListener } from "./infrastractures/event/game-created-event-listener";
import { GameRepositoryImpl } from "./infrastractures/game-repository";
import { GameShowedDownEventListener } from "./infrastractures/event/game-showed-down-event-listener";
import { createGameAction } from "./status/game-action";
import { HandCardUseCase } from "./usecases/hand-card";
import { ShowDownUseCase } from "./usecases/show-down";
import { NewGameUseCase } from "./usecases/new-game";
import { gameObserverContext } from "./contexts/observer";
import { GameObserverImpl } from "./infrastractures/game-observer";
import { UserRepositoryImpl } from "./infrastractures/user-repository";
import { JoinUserUseCase } from "./usecases/join-user";
import { NewGameStartedEventListener } from "./infrastractures/event/new-game-started-event-listener";
import { createUserActions } from "./status/user";
import { ChangeUserNameUseCase } from "./usecases/change-user-name";
import { ChangeUserModeUseCase } from "./usecases/change-user-mode";
import { GamePlayerRepositoryImpl } from "./infrastractures/game-player-repository";
import { createJoinService } from "./domains/join-service";
import { createGameSelectors } from "./status/game-selector";
import { UserLeaveFromGameEventListener } from "./infrastractures/event/user-leave-from-game-event-listener";
import { createDependencyRegistrar } from "./utils/dependency-registrar";
import { ApplicationDependencyRegistrar } from "./dependencies";
import { UserObserverImpl } from "./infrastractures/user-observer";
import signInActionContext, { SigninActions } from "./contexts/actions/signin-actions";
import createUseApplyAuthenticated from "./status/signin/actions/use-apply-authenticated";
import createUseSignIn from "./status/signin/actions/use-signin";
import createUseSignUp from "./status/signin/actions/use-signup";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const gameRepository = new GameRepositoryImpl(database);
const userRepository = new UserRepositoryImpl(database);
const gamePlayerRepository = new GamePlayerRepositoryImpl(database);

const dispatcher = new EventDispatcherImpl([
  new GameCreatedEventListener(gamePlayerRepository),
  new GameShowedDownEventListener(database),
  new NewGameStartedEventListener(database),
  new UserLeaveFromGameEventListener(gamePlayerRepository),
]);

const registrar = createDependencyRegistrar() as ApplicationDependencyRegistrar;
registrar.register("userRepository", userRepository);
registrar.register("userObserver", new UserObserverImpl(database, registrar.resolve("userRepository")));
registrar.register("gamePlayerRepository", gamePlayerRepository);
registrar.register("gameRepository", gameRepository);
registrar.register("handCardUseCase", new HandCardUseCase(dispatcher, registrar.resolve("gamePlayerRepository")));
registrar.register("showDownUseCase", new ShowDownUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("newGameUseCase", new NewGameUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register(
  "changeUserModeUseCase",
  new ChangeUserModeUseCase(dispatcher, registrar.resolve("gamePlayerRepository"))
);
registrar.register(
  "joinUserUseCase",
  new JoinUserUseCase(
    dispatcher,
    registrar.resolve("userRepository"),
    createJoinService(registrar.resolve("gameRepository"), registrar.resolve("gamePlayerRepository"))
  )
);
registrar.register("authenticator", new FirebaseAuthenticator(auth, database, registrar.resolve("userRepository")));
registrar.register("changeUserNameUseCase", new ChangeUserNameUseCase(dispatcher, registrar.resolve("userRepository")));

const gameAction = createGameAction(registrar);
const gameCreationActions = createGameCreationActions(registrar);
const signInActions: SigninActions = {
  useApplyAuthenticated: createUseApplyAuthenticated(registrar),
  useSignIn: createUseSignIn(registrar),
  useSignUp: createUseSignUp(registrar),
};
const userActions = createUserActions(registrar);
const gameSelector = createGameSelectors();

ReactDOM.render(
  <signInActionContext.Provider value={signInActions}>
    <gameCreationActionContext.Provider value={gameCreationActions}>
      <gameActionContext.Provider value={gameAction}>
        <userActionsContext.Provider value={userActions}>
          <gameObserverContext.Provider value={new GameObserverImpl(database, gameRepository)}>
            <gameSelectorContext.Provider value={gameSelector}>
              <App />
            </gameSelectorContext.Provider>
          </gameObserverContext.Provider>
        </userActionsContext.Provider>
      </gameActionContext.Provider>
    </gameCreationActionContext.Provider>
  </signInActionContext.Provider>,

  document.getElementById("root")
);
