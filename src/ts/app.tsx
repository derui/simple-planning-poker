import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { SigninContainer } from "./components/containers/signin-container";

export const App: React.FunctionComponent<{}> = () => {
  return (
    <BrowserRouter>
      <div className="app__root">
        <Route exact path="/" component={SigninContainer}></Route>
      </div>
    </BrowserRouter>
  );
};
