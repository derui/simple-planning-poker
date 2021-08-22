import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { gameCreationActionContext, signInActionContext } from "./contexts/actions";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { createSigninActions } from "./status/signin";
import { createGameCreationAction } from "./status/game-creator";
import { CreateGameUseCase } from "./usecases/create-game";
import { EventDispatcherImpl } from "./infrastractures/event/event-dispatcher";
import { GameCreatedEventListener } from "./infrastractures/event/game-created-event-listener";
import { GameRepositoryImpl } from "./infrastractures/game-repository";
import { UserCardSelectedEventListener } from "./infrastractures/event/user-card-selected-event-listener";
import { UserJoinedEventListener } from "./infrastractures/event/user-joined-event-listener";
import { GameShowedDownEventListener } from "./infrastractures/event/game-showed-down-event-listener";

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

const gameRepository = new GameRepositoryImpl();

ReactDOM.render(
  <signInActionContext.Provider value={createSigninActions(new FirebaseAuthenticator(auth, database))}>
    <gameCreationActionContext.Provider
      value={createGameCreationAction(new CreateGameUseCase(dispatcher, gameRepository))}
    >
      <App />
    </gameCreationActionContext.Provider>
  </signInActionContext.Provider>,

  document.getElementById("root")
);
