import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { App } from "./app";
import { firebaseConfig } from "./firebase.config";
import { FirebaseAuthenticator } from "./infrastractures/authenticator";
import { EventDispatcherImpl } from "./infrastractures/event/event-dispatcher";
import { GameCreatedEventListener } from "./infrastractures/event/game-created-event-listener";
import { GameRepositoryImpl } from "./infrastractures/game-repository";
import { GameShowedDownEventListener } from "./infrastractures/event/game-showed-down-event-listener";
import { HandCardUseCase } from "./usecases/hand-card";
import { ShowDownUseCase } from "./usecases/show-down";
import { NewGameUseCase } from "./usecases/new-game";
import { gameObserverContext } from "./contexts/observer";
import { GameObserverImpl } from "./infrastractures/game-observer";
import { UserRepositoryImpl } from "./infrastractures/user-repository";
import { JoinUserUseCase } from "./usecases/join-user";
import { NewGameStartedEventListener } from "./infrastractures/event/new-game-started-event-listener";
import { ChangeUserNameUseCase } from "./usecases/change-user-name";
import { ChangeUserModeUseCase } from "./usecases/change-user-mode";
import { GamePlayerRepositoryImpl } from "./infrastractures/game-player-repository";
import { createJoinService } from "./domains/join-service";
import { UserLeaveFromGameEventListener } from "./infrastractures/event/user-leave-from-game-event-listener";
import { createDependencyRegistrar } from "./utils/dependency-registrar";
import { ApplicationDependencyRegistrar } from "./dependencies";
import { UserObserverImpl } from "./infrastractures/user-observer";
import { signInActionContext, SigninActions } from "./contexts/actions/signin-actions";
import { createUseApplyAuthenticated } from "./status/signin/actions/use-apply-authenticated";
import { createUseSignIn } from "./status/signin/actions/use-signin";
import { createUseSignUp } from "./status/signin/actions/use-signup";
import { userActionsContext, UserActions } from "./contexts/actions/user-actions";
import { createUseChangeUserName } from "./status/user/actions/use-change-user-name";
import { createUseCreateGame } from "./status/game/actions/use-create-game";
import { gameActionsContext, GameActions } from "./contexts/actions/game-actions";
import { createUseOpenGame } from "./status/game/actions/use-open-game";
import { createUseJoinUser } from "./status/game/actions/use-join-user";
import { createUseLeaveGame } from "./status/game/actions/use-leave-game";
import { createUseNewGame } from "./status/game/actions/use-new-game";
import { createUseSelectCard } from "./status/game/actions/use-select-card";
import { createUseSelectGame } from "./status/game/actions/use-select-game";
import { createUseShowDown } from "./status/game/actions/use-show-down";
import { CreateGameUseCase } from "./usecases/create-game";
import { LeaveGameUseCase } from "./usecases/leave-game";
import { createUseChangeUserMode } from "./status/game/actions/use-change-user-mode";
import { initializeGameQuery } from "./status/game/signals/game-query";
import { render } from "solid-js/web";
import { Router } from "solid-app-router";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);
if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const gameRepository = new GameRepositoryImpl(database);
const userRepository = new UserRepositoryImpl(database);
const gamePlayerRepository = new GamePlayerRepositoryImpl(database);

const dispatcher = new EventDispatcherImpl([
  new GameCreatedEventListener(gamePlayerRepository),
  new GameShowedDownEventListener(database),
  new NewGameStartedEventListener(database),
  new UserLeaveFromGameEventListener(gamePlayerRepository),
]);

const registrar = createDependencyRegistrar() as ApplicationDependencyRegistrar;
registrar.register("userRepository", userRepository);
registrar.register("userObserver", new UserObserverImpl(database, registrar.resolve("userRepository")));
registrar.register("gamePlayerRepository", gamePlayerRepository);
registrar.register("gameRepository", gameRepository);
registrar.register("handCardUseCase", new HandCardUseCase(dispatcher, registrar.resolve("gamePlayerRepository")));
registrar.register("showDownUseCase", new ShowDownUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("newGameUseCase", new NewGameUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("createGameUseCase", new CreateGameUseCase(dispatcher, registrar.resolve("gameRepository")));
registrar.register("leaveGameUseCase", new LeaveGameUseCase(dispatcher, registrar.resolve("userRepository")));
registrar.register(
  "changeUserModeUseCase",
  new ChangeUserModeUseCase(dispatcher, registrar.resolve("gamePlayerRepository"))
);
registrar.register(
  "joinUserUseCase",
  new JoinUserUseCase(
    dispatcher,
    registrar.resolve("userRepository"),
    createJoinService(registrar.resolve("gameRepository"), registrar.resolve("gamePlayerRepository"))
  )
);
registrar.register("authenticator", new FirebaseAuthenticator(auth, database, registrar.resolve("userRepository")));
registrar.register("changeUserNameUseCase", new ChangeUserNameUseCase(dispatcher, registrar.resolve("userRepository")));
registrar.register("gameObserver", new GameObserverImpl(database, registrar.resolve("gameRepository")));

// initialize signals before launch
initializeGameQuery(registrar);

const gameAction: GameActions = {
  useCreateGame: createUseCreateGame(registrar),
  useOpenGame: createUseOpenGame(registrar),
  useChangeUserMode: createUseChangeUserMode(registrar),
  useJoinUser: createUseJoinUser(registrar),
  useLeaveGame: createUseLeaveGame(registrar),
  useNewGame: createUseNewGame(registrar),
  useSelectCard: createUseSelectCard(registrar),
  useSelectGame: createUseSelectGame(),
  useShowDown: createUseShowDown(registrar),
};
const signInActions: SigninActions = {
  useApplyAuthenticated: createUseApplyAuthenticated(registrar),
  useSignIn: createUseSignIn(registrar),
  useSignUp: createUseSignUp(registrar),
};
const userActions: UserActions = {
  useChangeUserName: createUseChangeUserName(registrar),
};

render(
  () => (
    <Router>
      <signInActionContext.Provider value={signInActions}>
        <gameActionsContext.Provider value={gameAction}>
          <userActionsContext.Provider value={userActions}>
            <gameObserverContext.Provider value={new GameObserverImpl(database, gameRepository)}>
              <App />
            </gameObserverContext.Provider>
          </userActionsContext.Provider>
        </gameActionsContext.Provider>
      </signInActionContext.Provider>
    </Router>
  ),

  document.getElementById("root")!!
);
