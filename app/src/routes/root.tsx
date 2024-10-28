import { GameCreator, GameIndex } from "@spp/feature-game";
import { AuthStatus, Login, SignIn, SignUp } from "@spp/feature-login";
import { PropsWithChildren, useEffect } from "react";
import { createBrowserRouter, redirect, useLocation, useNavigate } from "react-router-dom";
import { hooks } from "../../../features/login/src/hooks/facade.js";
import { RootLayout } from "./layout.js";
import { RevealedAreaRoute } from "./revealed-area.js";
import { VotingAreaRoute } from "./voting-area.js";

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
        loader: async () => redirect("/login"),
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
            <VotingAreaRoute />
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
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
