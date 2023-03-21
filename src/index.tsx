import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import * as ReactDOM from "react-dom/client";
import { install } from "@twind/core";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { EventDispatcherImpl } from "./infrastractures/event/event-dispatcher";
import { GameRepositoryImpl } from "./infrastractures/game-repository";
import { EstimatePlayerUseCase } from "./usecases/estimate-player";
import { ShowDownUseCase } from "./usecases/show-down";
import { GameObserverImpl } from "./infrastractures/game-observer";
import { UserRepositoryImpl } from "./infrastractures/user-repository";
import { JoinUserUseCase } from "./usecases/join-user";
import { ChangeUserNameUseCase } from "./usecases/change-user-name";
import { ChangeUserModeUseCase } from "./usecases/change-user-mode";
import { createDependencyRegistrar } from "./utils/dependency-registrar";
import { ApplicationDependencyRegistrar } from "./dependencies";
import { UserObserverImpl } from "./infrastractures/user-observer";
import { CreateGameUseCase } from "./usecases/create-game";
import { LeaveGameUseCase } from "./usecases/leave-game";
import config from "./twind.config.cjs";
import { RoundRepositoryImpl } from "./infrastractures/round-repository";
import { NewRoundUseCase } from "./usecases/new-round";
import { createStore } from "./status/store";
import { tryAuthenticate } from "./status/actions/signin";
import { routes } from "./routes/root";
import { CreateGameEventListener } from "./infrastractures/event/create-game-event-listener";
import { RoundObserverImpl } from "./infrastractures/round-observer";
import { JoinUserEventListener } from "./infrastractures/event/join-user-event-listener";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const gameRepository = new GameRepositoryImpl(database, new RoundRepositoryImpl(database));
const userRepository = new UserRepositoryImpl(database);

const dispatcher = new EventDispatcherImpl([
  new CreateGameEventListener(database),
  new JoinUserEventListener(database),
]);

const registrar = createDependencyRegistrar() as ApplicationDependencyRegistrar;
registrar.register("userRepository", userRepository);
registrar.register("userObserver", new UserObserverImpl(database, registrar.resolve("userRepository")));
registrar.register("roundObserver", new RoundObserverImpl(database));
registrar.register("gameRepository", gameRepository);
registrar.register("estimatePlayerUseCase", new EstimatePlayerUseCase(registrar.resolve("gameRepository")));
registrar.register("showDownUseCase", new ShowDownUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("newRoundUseCase", new NewRoundUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("createGameUseCase", new CreateGameUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("leaveGameUseCase", new LeaveGameUseCase(registrar.resolve("gameRepository")));
registrar.register("changeUserModeUseCase", new ChangeUserModeUseCase(registrar.resolve("gameRepository")));
registrar.register(
  "joinUserUseCase",
  new JoinUserUseCase(dispatcher, registrar.resolve("userRepository"), registrar.resolve("gameRepository"))
);
registrar.register("authenticator", new FirebaseAuthenticator(auth, database, registrar.resolve("userRepository")));
registrar.register("changeUserNameUseCase", new ChangeUserNameUseCase(dispatcher, registrar.resolve("userRepository")));
registrar.register("gameObserver", new GameObserverImpl(database, new RoundRepositoryImpl(database)));

install(config);

const store = createStore(registrar);

store.dispatch(tryAuthenticate());

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
