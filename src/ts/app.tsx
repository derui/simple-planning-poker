import React from "react";
import { BrowserRouter, Redirect, Route, RouteProps, Switch } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
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
      <div className="app__root">
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/">
              <GameCreatorContainer />
            </PrivateRoute>
            <Route exact path="/signin" component={SigninContainer}></Route>
          </Switch>
        </BrowserRouter>
      </div>
    </RecoilRoot>
  );
};
