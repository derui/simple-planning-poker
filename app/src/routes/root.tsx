import { AuthStatus, useAuth, useLoginUser } from "@spp/feature-login";
import React, { PropsWithChildren, Suspense, useCallback, useEffect } from "react";
import lazyImport from "../utils/lazy-import.js";

import { themeClass } from "@spp/ui-theme";
import { JSX } from "react/jsx-runtime";
import { Route, Switch, useLocation } from "wouter";
import { VotingPage } from "./voting-page.js";

// eslint-disable-next-line func-style
function PrivateRoute({ children }: PropsWithChildren) {
  const auth = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (auth.status == AuthStatus.NotAuthenticated) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [auth.status]);

  return children;
}

const LaziedGameIndexPage = React.lazy(() =>
  lazyImport(import("@spp/feature-game")).then((v) => ({ default: v.GameIndex }))
);

const LaziedLoginPage = React.lazy(() =>
  lazyImport(import("@spp/feature-login")).then((v) => ({ default: v.LoginPage }))
);

export const Routed = function Routed(): JSX.Element {
  const { checkLogined } = useAuth();
  const { userId } = useLoginUser();
  const [, navigate] = useLocation();

  useEffect(() => {
    checkLogined();
  }, [checkLogined]);

  const handleStartVoting = useCallback(
    (votingId: string) => {
      navigate(`/voting/${votingId}`);
    },
    [navigate]
  );

  const handleLogined = useCallback(() => {
    navigate("/game");
  }, [navigate]);

  return (
    <Suspense>
      <div id="theme" className={themeClass}>
        <Switch>
          <Route path="/game" nest>
            {() => (
              <PrivateRoute>
                <LaziedGameIndexPage userId={userId!!} onStartVoting={handleStartVoting} />
              </PrivateRoute>
            )}
          </Route>
          <Route path="/voting/:votingId" nest>
            {() => (
              <PrivateRoute>
                <VotingPage userId={userId!!} />
              </PrivateRoute>
            )}
          </Route>
          <Route nest>{() => <LaziedLoginPage onLogined={handleLogined} />}</Route>
        </Switch>
      </div>
    </Suspense>
  );
};
