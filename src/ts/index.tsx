import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import {
  gameCreationActionContext,
  inGameActionContext,
  inGameSelectorContext,
  signInActionContext,
  userActionsContext,
} from "./contexts/actions";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { createSigninActions } from "./status/signin";
import { createGameCreationActions } from "./status/game-creator";
import { CreateGameUseCase } from "./usecases/create-game";
import { EventDispatcherImpl } from "./infrastractures/event/event-dispatcher";
import { GameCreatedEventListener } from "./infrastractures/event/game-created-event-listener";
import { GameRepositoryImpl } from "./infrastractures/game-repository";
import { GameShowedDownEventListener } from "./infrastractures/event/game-showed-down-event-listener";
import { createInGameAction } from "./status/in-game-action";
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
import { createInGameSelectors } from "./status/in-game-selector";

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
]);

const inGameAction = createInGameAction({
  gameRepository,
  gamePlayerRepository,
  userRepository,
  handCardUseCase: new HandCardUseCase(dispatcher, gamePlayerRepository),
  showDownUseCase: new ShowDownUseCase(dispatcher, gameRepository),
  newGameUseCase: new NewGameUseCase(dispatcher, gameRepository),
  changeUserModeUseCase: new ChangeUserModeUseCase(dispatcher, gamePlayerRepository),
  joinUserUseCase: new JoinUserUseCase(
    dispatcher,
    userRepository,
    createJoinService(gameRepository, gamePlayerRepository)
  ),
});

const gameCreationActions = createGameCreationActions(
  gamePlayerRepository,
  new CreateGameUseCase(dispatcher, gameRepository)
);
const signInActions = createSigninActions(
  new FirebaseAuthenticator(auth, database, userRepository),
  userRepository,
  gameRepository
);
const userActions = createUserActions(new ChangeUserNameUseCase(dispatcher, userRepository));
const inGameSelector = createInGameSelectors();

ReactDOM.render(
  <signInActionContext.Provider value={signInActions}>
    <gameCreationActionContext.Provider value={gameCreationActions}>
      <inGameActionContext.Provider value={inGameAction}>
        <userActionsContext.Provider value={userActions}>
          <gameObserverContext.Provider value={new GameObserverImpl(database, gameRepository)}>
            <inGameSelectorContext.Provider value={inGameSelector}>
              <App />
            </inGameSelectorContext.Provider>
          </gameObserverContext.Provider>
        </userActionsContext.Provider>
      </inGameActionContext.Provider>
    </gameCreationActionContext.Provider>
  </signInActionContext.Provider>,

  document.getElementById("root")
);
