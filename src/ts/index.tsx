import firebase from "firebase/app";
import "firebase/database";
import React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./app";
import { firebaseConfig } from "./firebase.config";

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
if (location.hostname === "localhost") {
  database.useEmulator("localhost", 9000);
}

ReactDOM.render(<App />, document.getElementById("root"));
