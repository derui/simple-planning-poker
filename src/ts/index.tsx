import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { signInActionContext } from "./contexts/actions";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { createSigninActions } from "./status/signin";

const app = firebase.initializeApp(firebaseConfig);

const database = firebase.database(app);
const auth = firebase.auth(app);
if (location.hostname === "localhost") {
  database.useEmulator("localhost", 9000);
  auth.useEmulator("http://localhost:9099");
}

ReactDOM.render(
  <signInActionContext.Provider value={createSigninActions(new FirebaseAuthenticator(auth, database))}>
    <App />
  </signInActionContext.Provider>,
  document.getElementById("root")
);
