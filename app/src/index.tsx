import { CreateGameEventListener } from "@spp/infra-domain";
import { subscribe } from "@spp/shared-use-case";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { enableMapSet } from "immer";
import { Provider } from "jotai";
import { createRoot } from "react-dom/client";
import "./app.css.js";
import { firebaseConfig } from "./firebase.config.js";
import { Routed } from "./routes/root.js";

enableMapSet();

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const createdGameEventListener = new CreateGameEventListener();
subscribe((e) => createdGameEventListener.handle(e));

const root = createRoot(document.getElementById("root")!);

root.render(
  <Provider>
    <Routed />
  </Provider>
);
