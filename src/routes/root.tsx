import React, { PropsWithChildren, useEffect } from "react";
import { createBrowserRouter, redirect, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../components/hooks";
import { selectAuthenticated } from "../status/selectors/auth";
import lazyImport from "../utils/lazy-import";
import { RootLayout } from "./layout";

// eslint-disable-next-line func-style
function PrivateRoute({ children }: PropsWithChildren) {
  const state = useAppSelector(selectAuthenticated());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate("/signin", { state: { from: location }, replace: true });
    }
  }, [state]);

  return <>{children}</>;
}

const LaziedRoundPage = React.lazy(() => lazyImport(import("../components/pages/round")));
const LaziedRoundResultPage = React.lazy(() => lazyImport(import("../components/pages/round-result")));
const LaziedCreateGamePage = React.lazy(() => lazyImport(import("../components/pages/create-game")));
const LaziedSelectGamePage = React.lazy(() => lazyImport(import("../components/pages/select-game")));
const LaziedJoinPage = React.lazy(() => lazyImport(import("../components/pages/join-game")));
const LaziedSignInPage = React.lazy(() => lazyImport(import("../components/pages/signin")));
const LaziedSignUpPage = React.lazy(() => lazyImport(import("../components/pages/signup")));

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        path: "/",
        loader: async () => redirect("/game"),
      },
      {
        path: "/game/create",
        element: (
          <PrivateRoute>
            <LaziedCreateGamePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/game",
        element: (
          <PrivateRoute>
            <LaziedSelectGamePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/game/:gameId",
        element: (
          <PrivateRoute>
            <LaziedRoundPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/game/:gameId/result",
        element: (
          <PrivateRoute>
            <LaziedRoundResultPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/invitation/:signature",
        element: (
          <PrivateRoute>
            <LaziedJoinPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/signin",
        element: <LaziedSignInPage />,
      },
      {
        path: "/signup",
        element: <LaziedSignUpPage />,
      },
    ],
  },
]);
