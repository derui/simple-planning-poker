import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { ApplicationDependencyRegistrar } from "./dependencies";
import { firebaseConfig } from "./firebase.config";
import { routes } from "./routes/root";
import { createDependencyRegistrar } from "./utils/dependency-registrar";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const gameRepository = new GameRepository(database);
const userRepository = new UserRepositoryImpl(database);
const roundRepository = new RoundRepositoryImpl(database);
const roundHistoryRepository = new RoundHistoryRepositoryImpl(database);

const dispatcher = new EventDispatcherImpl([
  new CreateGameEventListener(database),
  new JoinUserEventListener(database),
  new CreateRoundAfterCreateGameListener(roundRepository),
  new NewRoundStartedListener(gameRepository),
  new RemoveGameFromJoinedGameListener(database),
  new FinishedRoundRecordingListener(roundRepository, roundHistoryRepository),
]);

const registrar = createDependencyRegistrar() as ApplicationDependencyRegistrar;
registrar.register("gameRepository", gameRepository);
registrar.register("userRepository", userRepository);
registrar.register(
  "userObserver",
  new UserObserverImpl(database, registrar.resolve("userRepository"), registrar.resolve("gameRepository"))
);
registrar.register("roundObserver", new RoundObserverImpl(database));
registrar.register("roundRepository", roundRepository);
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
registrar.register("changeThemeUseCase", new ChangeThemeUseCase(roundRepository));
registrar.register("roundHistoryQuery", roundHistoryRepository);

const store = createStore(registrar, process.env.NODE_ENV === "production");

store.dispatch(tryAuthenticate());

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <RouterProvider router={routes} />
  </Provider>
);
