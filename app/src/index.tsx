import {
  createUseCreateGame,
  createUseListGames,
  ImplementationProvider as GameFeatureImplementationProvider,
  Hooks as GameHooks,
} from "@spp/feature-game";
import {
  createUseAuth,
  createUseLogin,
  createUseLoginUser,
  ImplementationProvider as LoginFeatureImplementationProvider,
  Hooks as LoginHooks,
} from "@spp/feature-login";
import {
  createUseJoin,
  createUsePollingPlace,
  createUseRevealed,
  createUseVoting,
  createUseVotingStatus,
  ImplementationProvider as VotingFeatureImplementationProvider,
  Hooks as VotingHooks,
} from "@spp/feature-voting";
import { newFirebaseAuthenticator } from "@spp/infra-authenticator/firebase.js";
import {
  CreateGameEventListener,
  GameRepositoryImpl,
  newEventDispatcher,
  UserRepositoryImpl,
  VotingRepositoryImpl,
} from "@spp/infra-domain";
import {
  newChangeThemeUseCase,
  newChangeUserModeUseCase,
  newEstimatePlayerUseCase,
  newResetVotingUseCase,
  newRevealUseCase,
  newStartVotingUseCase,
} from "@spp/shared-use-case";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { Provider } from "jotai";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./app.css.js";
import { firebaseConfig } from "./firebase.config.js";
import { routes } from "./routes/root.js";

const firebaseApp = initializeApp(firebaseConfig);

const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

if (location.hostname === "localhost") {
  connectDatabaseEmulator(database, "localhost", 9000);
  connectAuthEmulator(auth, "http://localhost:9099");
}

const gameRepository = new GameRepositoryImpl(database);
const userRepository = new UserRepositoryImpl(database);
const votingRepository = new VotingRepositoryImpl(database);
const authenticator = newFirebaseAuthenticator(auth, userRepository);

const dispatcher = newEventDispatcher([new CreateGameEventListener(database)]);

const loginHooks: LoginHooks = {
  useAuth: createUseAuth(authenticator),
  useLogin: createUseLogin(authenticator),
};

const gameHooks: GameHooks = {
  useCreateGame: createUseCreateGame({ gameRepository, dispatcher, useLoginUser: createUseLoginUser() }),
  useListGames: createUseListGames({
    gameRepository,
    useLoginUser: createUseLoginUser(),
    startVotingUseCase: newStartVotingUseCase(gameRepository, votingRepository, dispatcher),
  }),
};

const votingHooks: VotingHooks = {
  useJoin: createUseJoin(createUseLoginUser(), votingRepository, userRepository),
  useVoting: createUseVoting({
    useLoginUser: createUseLoginUser(),
    changeThemeUseCase: newChangeThemeUseCase(votingRepository),
    estimatePlayerUseCase: newEstimatePlayerUseCase(votingRepository),
    changeUserModeUseCase: newChangeUserModeUseCase(votingRepository, dispatcher),
    revealUseCase: newRevealUseCase(dispatcher, votingRepository),
  }),
  useRevealed: createUseRevealed({
    changeThemeUseCase: newChangeThemeUseCase(votingRepository),
    resetVotingUseCase: newResetVotingUseCase(dispatcher, votingRepository),
  }),
  usePollingPlace: createUsePollingPlace(),
  useVotingStatus: createUseVotingStatus(),
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <Provider>
    <LoginFeatureImplementationProvider implementation={loginHooks}>
      <GameFeatureImplementationProvider implementation={gameHooks}>
        <VotingFeatureImplementationProvider implementation={votingHooks}>
          <RouterProvider router={routes} />
        </VotingFeatureImplementationProvider>
      </GameFeatureImplementationProvider>
    </LoginFeatureImplementationProvider>
  </Provider>
);
