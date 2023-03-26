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
import { CreateRoundAfterCreateGameListener } from "./infrastractures/event/create-round-after-create-game-listener";
import { NewRoundStartedListener } from "./infrastractures/event/new-round-started-listener";
import { RemoveGameFromJoinedGameListener } from "./infrastractures/event/remove-game-from-joined-games-listener";
import { KickPlayerUseCase } from "./usecases/kick-player";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const gameRepository = new GameRepositoryImpl(database);
const userRepository = new UserRepositoryImpl(database);
const roundRepository = new RoundRepositoryImpl(database);

const dispatcher = new EventDispatcherImpl([
  new CreateGameEventListener(database),
  new JoinUserEventListener(database),
  new CreateRoundAfterCreateGameListener(roundRepository),
  new NewRoundStartedListener(gameRepository),
  new RemoveGameFromJoinedGameListener(database),
]);

const registrar = createDependencyRegistrar() as ApplicationDependencyRegistrar;
registrar.register("gameRepository", gameRepository);
registrar.register("userRepository", userRepository);
registrar.register(
  "userObserver",
  new UserObserverImpl(database, registrar.resolve("userRepository"), registrar.resolve("gameRepository"))
);
registrar.register("roundObserver", new RoundObserverImpl(database));
registrar.register("estimatePlayerUseCase", new EstimatePlayerUseCase(roundRepository));
registrar.register("showDownUseCase", new ShowDownUseCase(dispatcher, roundRepository));
registrar.register(
  "newRoundUseCase",
  new NewRoundUseCase(dispatcher, registrar.resolve("gameRepository"), roundRepository)
);
registrar.register("createGameUseCase", new CreateGameUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("leaveGameUseCase", new LeaveGameUseCase(registrar.resolve("gameRepository"), dispatcher));
registrar.register("changeUserModeUseCase", new ChangeUserModeUseCase(registrar.resolve("gameRepository")));
registrar.register(
  "joinUserUseCase",
  new JoinUserUseCase(dispatcher, registrar.resolve("userRepository"), registrar.resolve("gameRepository"))
);
registrar.register("authenticator", new FirebaseAuthenticator(auth, database, registrar.resolve("userRepository")));
registrar.register("changeUserNameUseCase", new ChangeUserNameUseCase(dispatcher, registrar.resolve("userRepository")));
registrar.register("gameObserver", new GameObserverImpl(database));
registrar.register("kickPlayerUseCase", new KickPlayerUseCase(dispatcher, gameRepository));

install(config, process.env.NODE_ENV === "production");

const store = createStore(registrar, process.env.NODE_ENV === "production");

store.dispatch(tryAuthenticate());

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
