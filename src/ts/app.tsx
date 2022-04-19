import React, { Suspense } from "react";
import { useLocation } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import TransitionFallback from "./components/presentations/transition-fallback";
import { useAuthenticatedState } from "./status/signin/selectors";
import lazyImport from "./utils/lazy-import";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const state = useAuthenticatedState();
  const location = useLocation();

  if (!state) {
    return <Navigate replace to="/signin" state={{ from: location }} />;
  }

  return children;
};

export const App: React.FunctionComponent<{}> = () => {
  const LaziedGameContainer = React.lazy(() => lazyImport(import("./components/containers/game-container")));
  const LaziedGameResultContainer = React.lazy(() =>
    lazyImport(import("./components/containers/game-result-container"))
  );
  const LaziedGameCreatorContainer = React.lazy(() =>
    lazyImport(import("./components/containers/game-creator-container"))
  );
  const LaziedGameSelectorContainer = React.lazy(() =>
    lazyImport(import("./components/containers/game-selector-container"))
  );
  const LaziedInvitationContainer = React.lazy(() =>
    lazyImport(import("./components/containers/invitation-container"))
  );
  const LaziedSignInContainer = React.lazy(() => lazyImport(import("./components/containers/signin-container")));
  const LaziedSignUpContainer = React.lazy(() => lazyImport(import("./components/containers/signup-container")));

  return (
    <RecoilRoot>
      <Suspense fallback={<TransitionFallback />}>
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
      </Suspense>
    </RecoilRoot>
  );
};
