import { AuthStatus, useAuth, useLoginUser } from "@spp/feature-login";
import React, { PropsWithChildren, Suspense, useEffect } from "react";
import lazyImport from "../utils/lazy-import.js";

import { themeClass } from "@spp/ui-theme";
import { JSX } from "react/jsx-runtime";
import { useLocation } from "wouter";

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
const VotingPage = React.lazy(() => lazyImport(import("@spp/feature-voting")).then((v) => ({ default: v.VotingPage })));

const LaziedLoginPage = React.lazy(() =>
  lazyImport(import("@spp/feature-login")).then((v) => ({ default: v.LoginPage }))
);

export const Routed = function Routed(): JSX.Element {
  const { checkLogined } = useAuth();
  const { userId } = useLoginUser();

  useEffect(() => {
    checkLogined();
  }, [checkLogined]);

  return (
    <Suspense>
      <div id="theme" className={themeClass}></div>
    </Suspense>
  );
};
