import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, RouteProps, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import GameContainer from "./components/containers/game-container";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
import { GameObserverContainer } from "./components/containers/game-observer";
import { GameSelectorContainerComponent } from "./components/containers/game-selector-container";
import { InvitationContainer } from "./components/containers/invitation-container";
import { SignInContainer } from "./components/containers/signin-container";
import { SignUpContainer } from "./components/containers/signup-container";
import authenticatedState from "./status/signin/selectors/authenticated";

const PrivateRoute: React.FunctionComponent<RouteProps> = ({ children, ...rest }) => {
  const state = authenticatedState();

  const element = state ? children : <Navigate replace to="/signin" state={{ from: location }} />;

  return <Route {...rest} element={element} />;
};

export const App: React.FunctionComponent<{}> = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div>loading</div>}>
        <div className="app__root">
          <BrowserRouter>
            <Routes>
              <PrivateRoute path="/game/create">
                <GameCreatorContainer />
              </PrivateRoute>
              <PrivateRoute path="/">
                <GameSelectorContainerComponent />
              </PrivateRoute>
              <PrivateRoute path="/game/:gameId">
                <GameObserverContainer />
                <GameContainer />
              </PrivateRoute>
              <PrivateRoute path="/invitation/:signature">
                <InvitationContainer />
              </PrivateRoute>
              <Route path="/signin" element={<SignInContainer />}></Route>
              <Route path="/signup" element={<SignUpContainer />}></Route>
            </Routes>
          </BrowserRouter>
        </div>
      </Suspense>
    </RecoilRoot>
  );
};
