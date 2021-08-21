import firebase from "firebase/app";
import "firebase/database";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { signInActionContext } from "./contexts/actions";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { createSigninActions } from "./status/signin";

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
if (location.hostname === "localhost") {
  database.useEmulator("localhost", 9000);
  auth.useEmulator("localhost:9090");
}

ReactDOM.render(
  <signInActionContext.Provider value={createSigninActions(new FirebaseAuthenticator(auth, database))}>
    <App />
  </signInActionContext.Provider>,
  document.getElementById("root")
);
