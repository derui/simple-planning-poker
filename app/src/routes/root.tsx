import { GameCreator, GameIndex } from "@spp/feature-game";
import { AuthStatus } from "@spp/feature-login";
import { PropsWithChildren, useEffect } from "react";
import { createBrowserRouter, redirect, useLocation, useNavigate } from "react-router-dom";
import { hooks } from "../../../features/login/src/hooks/facade.js";
import { RootLayout } from "./layout.js";
import { RevealedAreaRoute } from "./revealed-area.js";

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
            <GameCreator />
          </PrivateRoute>
        ),
      },
      {
        path: "/game",
        element: (
          <PrivateRoute>
            <GameIndex />
          </PrivateRoute>
        ),
      },
      {
        path: "/voting/:votingId",
        element: (
          <PrivateRoute>
            <VoringAreaRoute />
          </PrivateRoute>
        ),
      },
      {
        path: "/voting/:votingId/revealed",
        element: (
          <PrivateRoute>
            <RevealedAreaRoute />
          </PrivateRoute>
        ),
      },
      {
        path: "/game/:gameId/round/:roundId/result",
        element: (
          <PrivateRoute>
            <LaziedRoundResultPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/game/:gameId/round/:roundId/history",
        element: (
          <PrivateRoute>
            <LaziedRoundHistoryPage />
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
        element: <LaziedSignInPage method="signIn" />,
      },
      {
        path: "/signup",
        element: <LaziedSignInPage method="signUp" />,
      },
    ],
  },
]);
