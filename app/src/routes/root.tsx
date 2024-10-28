import { AuthStatus } from "@spp/feature-login";
import React, { PropsWithChildren, useEffect } from "react";
import { createBrowserRouter, redirect, useLocation, useNavigate } from "react-router-dom";
import { hooks } from "../../../features/login/src/hooks/facade.js";
import lazyImport from "../utils/lazy-import.js";
import { RootLayout } from "./layout.js";

// eslint-disable-next-line func-style
function PrivateRoute({ children }: PropsWithChildren) {
  const auth = hooks.useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    auth.checkLogined();
  }, []);

  useEffect(() => {
    if (auth.status == AuthStatus.NotAuthenticated) {
      navigate("/signin", { state: { from: location }, replace: true });
    } else {
      navigate(location.pathname);
    }
  }, [auth.status]);

  return children;
}

const LaziedGameCreator = React.lazy(() =>
  lazyImport(import("@spp/feature-game")).then((v) => ({ default: v.GameCreator }))
);
const LaziedGameIndex = React.lazy(() =>
  lazyImport(import("@spp/feature-game")).then((v) => ({ default: v.GameIndex }))
);
const LaziedVotingAreaRoute = React.lazy(() =>
  lazyImport(import("@spp/feature-voting")).then((v) => ({ default: v.VotingArea }))
);
const LaziedRevealedAreaRoute = React.lazy(() =>
  lazyImport(import("@spp/feature-voting")).then((v) => ({ default: v.RevealedArea }))
);
const LaziedSignIn = React.lazy(() => lazyImport(import("@spp/feature-login")).then((v) => ({ default: v.SignIn })));
const LaziedSignUp = React.lazy(() => lazyImport(import("@spp/feature-login")).then((v) => ({ default: v.SignUp })));
const LaziedLogin = React.lazy(() => lazyImport(import("@spp/feature-login")).then((v) => ({ default: v.Login })));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: "/",
        loader: async () => redirect("/login"),
      },
      {
        path: "/game/create",
        element: (
          <PrivateRoute>
            <LaziedGameCreator />
          </PrivateRoute>
        ),
      },
      {
        path: "/game",
        element: (
          <PrivateRoute>
            <LaziedGameIndex />
          </PrivateRoute>
        ),
      },
      {
        path: "/voting/:votingId",
        element: (
          <PrivateRoute>
            <LaziedVotingAreaRoute />
          </PrivateRoute>
        ),
      },
      {
        path: "/voting/:votingId/revealed",
        element: (
          <PrivateRoute>
            <LaziedRevealedAreaRoute />
          </PrivateRoute>
        ),
      },
      {
        path: "/signin",
        element: <LaziedSignIn />,
      },
      {
        path: "/signup",
        element: <LaziedSignUp />,
      },
      {
        path: "/login",
        element: <LaziedLogin />,
      },
    ],
  },
]);
