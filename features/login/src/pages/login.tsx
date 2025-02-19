import { useEffect } from "react";

import { Route, Switch } from "wouter";

import { AuthStatus } from "../atoms/type.js";
import { useAuth } from "../atoms/use-auth.js";
import { Login } from "../components/containers/login.js";
import { SignIn } from "../components/containers/signin.js";
import { SignUp } from "../components/containers/signup.js";

export interface Props {
  /**
   * A callback function to be invoked when the user is logged in.
   */
  onLogined: () => void;
}

// eslint-disable-next-line func-style
export function LoginPage({ onLogined }: Props): JSX.Element {
  const { checkLogined, status } = useAuth();

  useEffect(() => {
    checkLogined();
  }, [checkLogined]);

  useEffect(() => {
    if (status == AuthStatus.Authenticated) {
      onLogined();
    }
  }, [status]);

  return (
    <Switch>
      <Route path="/signin">
        <SignIn />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route path="/">
        <Login />
      </Route>
    </Switch>
  );
}
