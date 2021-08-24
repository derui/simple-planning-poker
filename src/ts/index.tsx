import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { gameCreationActionContext, inGameActionContext, signInActionContext } from "./contexts/actions";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { createSigninActions } from "./status/signin";
import { createGameCreationActions } from "./status/game-creator";
import { CreateGameUseCase } from "./usecases/create-game";
import { EventDispatcherImpl } from "./infrastractures/event/event-dispatcher";
import { GameCreatedEventListener } from "./infrastractures/event/game-created-event-listener";
import { GameRepositoryImpl } from "./infrastractures/game-repository";
import { UserCardSelectedEventListener } from "./infrastractures/event/user-card-selected-event-listener";
import { UserJoinedEventListener } from "./infrastractures/event/user-joined-event-listener";
import { GameShowedDownEventListener } from "./infrastractures/event/game-showed-down-event-listener";
import { createInGameAction } from "./status/in-game";
import { HandCardUseCase } from "./usecases/hand-card";
import { ShowDownUseCase } from "./usecases/show-down";
import { NewGameUseCase } from "./usecases/new-game";
import { gameObserverContext } from "./contexts/observer";
import { GameObserverImpl } from "./infrastractures/game-observer";
import { UserRepositoryImpl } from "./infrastractures/user-repository";

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
if (location.hostname === "localhost") {
  database.useEmulator("localhost", 9000);
  auth.useEmulator("http://localhost:9099");
}

const dispatcher = new EventDispatcherImpl([
  new GameCreatedEventListener(database),
  new GameShowedDownEventListener(database),
  new UserCardSelectedEventListener(database),
  new UserJoinedEventListener(database),
]);

const gameRepository = new GameRepositoryImpl(database);
const userRepository = new UserRepositoryImpl(database);
const inGameAction = createInGameAction(
  gameRepository,
  new HandCardUseCase(dispatcher, gameRepository),
  new ShowDownUseCase(dispatcher, gameRepository),
  new NewGameUseCase(dispatcher, gameRepository)
);

const gameCreationActions = createGameCreationActions(new CreateGameUseCase(dispatcher, gameRepository));
const signInActions = createSigninActions(new FirebaseAuthenticator(auth, database, userRepository), userRepository);

ReactDOM.render(
  <signInActionContext.Provider value={signInActions}>
    <gameCreationActionContext.Provider value={gameCreationActions}>
      <inGameActionContext.Provider value={inGameAction}>
        <gameObserverContext.Provider value={new GameObserverImpl(database, gameRepository)}>
          <App />
        </gameObserverContext.Provider>
      </inGameActionContext.Provider>
    </gameCreationActionContext.Provider>
  </signInActionContext.Provider>,

  document.getElementById("root")
);
