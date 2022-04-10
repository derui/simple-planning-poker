import React, { Suspense } from "react";
import { useLocation } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import GameContainer from "./components/containers/game-container";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
import { GameSelectorContainerComponent } from "./components/containers/game-selector-container";
import { InvitationContainer } from "./components/containers/invitation-container";
import { SignInContainer } from "./components/containers/signin-container";
import { SignUpContainer } from "./components/containers/signup-container";
import { useAuthenticatedState } from "./status/signin/selectors";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const state = useAuthenticatedState();
  const location = useLocation();

  if (!state) {
    return <Navigate replace to="/signin" state={{ from: location }} />;
  }

  return children;
};

export const App: React.FunctionComponent<{}> = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div>loading</div>}>
        <div className="app__root">
          <BrowserRouter>
            <Routes>
              <Route
                path="/game/create"
                element={
                  <PrivateRoute>
                    <GameCreatorContainer />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <GameSelectorContainerComponent />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/game/:gameId"
                element={
                  <PrivateRoute>
                    <GameContainer />
                  </PrivateRoute>
                }
              ></Route>
              <Route
                path="/invitation/:signature"
                element={
                  <PrivateRoute>
                    <InvitationContainer />
                  </PrivateRoute>
                }
              ></Route>
              <Route path="/signin" element={<SignInContainer />}></Route>
              <Route path="/signup" element={<SignUpContainer />}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </Suspense>
    </RecoilRoot>
  );
};
