import { Component, ParentProps } from "solid-js";
import { useAuthenticatedState } from "./status/signin/selectors";
import { Routes, Route, useLocation, useNavigate } from "solid-app-router";
import { GameContainer } from "./components/containers/game-container";
import { GameCreatorContainer } from "./components/containers/game-creator-container";
import { GameSelectorContainer } from "./components/containers/game-selector-container";
import { GameResultContainer } from "./components/containers/game-result-container";
import { InvitationContainer } from "./components/containers/invitation-container";
import { SignInContainer } from "./components/containers/signin-container";
import { SignUpContainer } from "./components/containers/signup-container";

const PrivateRoute: Component<ParentProps> = (props) => {
  const state = useAuthenticatedState();
  const location = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/signin", { state: { from: location } });
  }

  return props.children;
};

export const App: Component = () => {
  return (
    <div class="app__root">
      <Routes>
        <Route
          path="/game/create"
          element={
            <PrivateRoute>
              <GameCreatorContainer />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/">
          <PrivateRoute>
            <GameSelectorContainer />
          </PrivateRoute>
        </Route>
        <Route path="/game/:gameId">
          <PrivateRoute>
            <GameContainer />
          </PrivateRoute>
        </Route>
        <Route path="/game/:gameId/result">
          <PrivateRoute>
            <GameResultContainer />
          </PrivateRoute>
        </Route>
        <Route path="/invitation/:signature">
          <PrivateRoute>
            <InvitationContainer />
          </PrivateRoute>
        </Route>
        <Route path="/signin" element={<SignInContainer />} />
        <Route path="/signup" element={<SignUpContainer />} />
      </Routes>
    </div>
  );
};
