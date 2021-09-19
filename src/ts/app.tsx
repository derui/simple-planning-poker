import React, { Suspense } from "react";
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { GameContainer } from "./components/containers/game-container";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
import { GameObserverContainer } from "./components/containers/game-observer";
import { InvitationContainer } from "./components/containers/invitation-container";
import { SigninContainer } from "./components/containers/signin-container";
import { signInSelectors } from "./status/signin";

const PrivateRoute: React.FunctionComponent<RouteProps> = ({ children, ...rest }) => {
  const authenticated = signInSelectors.useAuthenticated();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export const App: React.FunctionComponent<{}> = () => {
  return (
    <RecoilRoot>
      <Suspense fallback={<div>loading</div>}>
        <div className="app__root">
          <BrowserRouter>
            <Switch>
              <PrivateRoute exact path="/">
                <GameCreatorContainer />
              </PrivateRoute>
              <PrivateRoute path="/game/:gameId">
                <GameObserverContainer />
                <GameContainer />
              </PrivateRoute>
              <PrivateRoute path="/invitation/:signature">
                <InvitationContainer />
              </PrivateRoute>
              <Route exact path="/signin" component={SigninContainer}></Route>
            </Switch>
          </BrowserRouter>
        </div>
      </Suspense>
    </RecoilRoot>
  );
};
