import { initializeApp } from "firebase/app";
import {
  child,
  connectDatabaseEmulator,
  get,
  getDatabase,
  ref,
  remove,
  set,
  update,
  onValue,
  DataSnapshot,
} from "firebase/database";
import {
  Auth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseConfig } from "./firebase.config";

declare var window: Window & {
  firebaseDatabase: any;
  firebaseAuth: any;
};

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

export const firebaseDatabase = {
  create: () => database,
  ref,
  child,
  get: get,
  update,
  remove,
  set,
  val: (ref: DataSnapshot) => {
    return ref.val();
  },
  eval,
  onValue,
};

export const firebaseAuth = {
  createAuth: () => auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signedInUserId(cred: any) {
    return cred.user.uid;
  },
  currentUserId(auth: Auth) {
    return auth.currentUser?.uid;
  },
};

window.firebaseDatabase = firebaseDatabase;
window.firebaseAuth = firebaseAuth;

import("./load-wasm");
