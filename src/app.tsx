import React, { PropsWithChildren } from "react";
import { useLocation } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./components/hooks";
import { selectAuthenticating } from "./status/selectors/auth";
import lazyImport from "./utils/lazy-import";

// eslint-disable-next-line func-style
function PrivateRoute({ children }: PropsWithChildren) {
  const state = useAppSelector(selectAuthenticating);
  const location = useLocation();

  if (!state) {
    return <Navigate replace to="/signin" state={{ from: location }} />;
  }

  return <>{children}</>;
}

// eslint-disable-next-line func-style
export function App() {
  const LaziedRoundPage = React.lazy(() => lazyImport(import("./components/pages/round")));
  const LaziedRoundResultPage = React.lazy(() => lazyImport(import("./components/pages/round-result")));
  const LaziedCreateGamePage = React.lazy(() => lazyImport(import("./components/pages/create-game")));
  const LaziedSelectGamePage = React.lazy(() => lazyImport(import("./components/pages/select-game")));
  const LaziedJoinPage = React.lazy(() => lazyImport(import("./components/pages/join-game")));
  const LaziedSignInPage = React.lazy(() => lazyImport(import("./components/pages/signin")));

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/game/create"
            element={
              <PrivateRoute>
                <LaziedCreateGamePage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <LaziedSelectGamePage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/game/:gameId"
            element={
              <PrivateRoute>
                <LaziedRoundPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/game/:gameId/result"
            element={
              <PrivateRoute>
                <LaziedRoundResultPage />
              </PrivateRoute>
            }
          ></Route>
          <Route
            path="/invitation/:signature"
            element={
              <PrivateRoute>
                <LaziedJoinPage />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/signin" element={<LaziedSignInPage method="signIn" />}></Route>
          <Route path="/signup" element={<LaziedSignInPage method="signUp" />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
