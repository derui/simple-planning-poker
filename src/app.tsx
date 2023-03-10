import React, { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./components/hooks";
import { selectAuthenticating } from "./status/selectors/auth";
import lazyImport from "./utils/lazy-import";

// eslint-disable-next-line func-style
function PrivateRoute({ children }: PropsWithChildren) {
  const state = useAppSelector(selectAuthenticating());
  const location = useLocation();

  if (!state) {
    return <Navigate replace to="/signin" state={{ from: location }} />;
  }

  return <>{children}</>;
}

export const App: React.FunctionComponent<{}> = () => {
  const LaziedGameContainer = React.lazy(() => lazyImport(import("./components/pages/round")));
  const LaziedGameResultContainer = React.lazy(() => lazyImport(import("./components/pages/round-result")));
  const LaziedGameCreatorContainer = React.lazy(() => lazyImport(import("./components/pages/create-game")));
  const LaziedGameSelectorContainer = React.lazy(() => lazyImport(import("./components/pages/select-game")));
  const LaziedInvitationContainer = React.lazy(() => lazyImport(import("./components/pages/join-game")));
  const LaziedSignInContainer = React.lazy(() => lazyImport(import("./components/pages/signin")));
  const LaziedSignUpContainer = React.lazy(() => lazyImport(import("./components/pages/signup")));

  return (
    <div className="app__root">
      <BrowserRouter>
        <Routes>
          <Route
            path="/game/create"
            element={
              <PrivateRoute>
                <LaziedGameCreatorContainer />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <LaziedGameSelectorContainer />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/game/:gameId"
            element={
              <PrivateRoute>
                <LaziedGameContainer />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/game/:gameId/result"
            element={
              <PrivateRoute>
                <LaziedGameResultContainer />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/invitation/:signature"
            element={
              <PrivateRoute>
                <LaziedInvitationContainer />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/signin" element={<LaziedSignInContainer />}></Route>
          <Route path="/signup" element={<LaziedSignUpContainer />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
