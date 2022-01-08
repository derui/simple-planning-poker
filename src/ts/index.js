import { initializeApp } from "firebase/app";
import { child, connectDatabaseEmulator, get, getDatabase, ref, remove, set, update, onValue } from "firebase/database";
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export const firebaseDatabase = {
  new: () => database,
  ref,
  child,
  get: get,
  update,
  remove,
  set,
  eval,
  onValue
};

export const firebaseAuth = {
  create: () => auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signedInUserId(cred) {
    return cred.user.uid;
  },
};

window.firebaseDatabase = firebaseDatabase;
window.firebaseAuth = firebaseAuth;

import("../rust/planning_poker/pkg").catch(console.error);
