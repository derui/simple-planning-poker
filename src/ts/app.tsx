import { Component } from "solid-js";
import { Outlet, useLocation, useNavigate, useRoutes } from "solid-app-router";
import { GameContainer } from "./components/containers/game-container";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
import { GameResultContainer } from "./components/containers/game-result-container";
import { InvitationContainer } from "./components/containers/invitation-container";
import { SignInContainer } from "./components/containers/signin-container";
import { SignUpContainer } from "./components/containers/signup-container";
import { useSignInSelectors } from "./contexts/selectors/signin-selectors";
import { setSignInState } from "./status/signin/signals/signin-state";
import { GameSelectorContainer } from "./components/containers/game-selector-container";

const PrivateRoute: Component = () => {
  const { authenticated } = useSignInSelectors();
  const location = useLocation<{ from: string }>();
  const navigate = useNavigate();

  if (!authenticated()) {
    setSignInState((prev) => ({ ...prev, locationToNavigate: location.pathname }));
    navigate("/signin", { replace: true });
  }

  return <Outlet />;
};

const Redirector = () => {
  const navigate = useNavigate();

  navigate("/game", { replace: true });

  return null;
};

const routes = [
  {
    path: "/",
    component: () => <Redirector />,
  },
  {
    path: "/game",
    component: () => <PrivateRoute />,
    children: [
      {
        path: "/create",
        component: () => <GameCreatorContainer />,
      },
      {
        path: "/",
        component: () => <GameSelectorContainer />,
      },
      {
        path: "/play/:gameId",
        component: () => <GameContainer />,
      },
      {
        path: "/result/:gameId",
        component: () => <GameResultContainer />,
      },
      {
        path: "/invitation/:signature",
        component: () => <InvitationContainer />,
      },
    ],
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
