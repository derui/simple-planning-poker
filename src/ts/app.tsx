import { children, Component, ParentProps } from "solid-js";
import { useLocation, useNavigate, useRoutes } from "solid-app-router";
import { GameContainer } from "./components/containers/game-container";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
import { GameSelectorContainer } from "./components/containers/game-selector-container";
import { GameResultContainer } from "./components/containers/game-result-container";
import { InvitationContainer } from "./components/containers/invitation-container";
import { SignInContainer } from "./components/containers/signin-container";
import { SignUpContainer } from "./components/containers/signup-container";
import { useSignInSelectors } from "./contexts/selectors/signin-selectors";

const PrivateRoute: Component<ParentProps> = (props) => {
  const { authenticated } = useSignInSelectors();
  const location = useLocation<{ from: string }>();
  const navigate = useNavigate();
  const childRoute = children(() => props.children);

  if (!authenticated()) {
    console.log(location.pathname);
    navigate("/signin", { replace: true, state: { from: location.pathname } });
  }

  return childRoute;
};

const routes = [
  {
    path: "/game/create",
    component: () => (
      <PrivateRoute>
        <GameCreatorContainer />
      </PrivateRoute>
    ),
  },
  {
    path: "/",
    component: () => (
      <PrivateRoute>
        <GameSelectorContainer />
      </PrivateRoute>
    ),
  },
  {
    path: "/game/:gameId",
    component: () => (
      <PrivateRoute>
        <GameContainer />
      </PrivateRoute>
    ),
  },
  {
    path: "/game/:gameId/result",
    component: () => (
      <PrivateRoute>
        <GameResultContainer />
      </PrivateRoute>
    ),
  },
  {
    path: "/invitation/:signature",
    component: () => (
      <PrivateRoute>
        <InvitationContainer />
      </PrivateRoute>
    ),
  },
  {
    path: "/signin",
    component: () => <SignInContainer />,
  },
  {
    path: "/signup",
    component: () => <SignUpContainer />,
  },
];

export const App: Component = () => {
  const Routes = useRoutes(routes);
  return (
    <div class="app__root">
      <Routes></Routes>
    </div>
  );
};
