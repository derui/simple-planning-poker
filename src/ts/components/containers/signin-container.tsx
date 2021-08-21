import * as React from "react";
import { RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps {}

export const SigninContainer: React.FunctionComponent<Props> = () => {
  return (
    <React.Fragment>
      <div className="app__signin-overlay"></div>
      <div className="app__signin-root">
        <header className="app__signin-header">Sign in</header>
        <main className="app__signin-main">
          <h3 className="app__signin-main__description">Sign in with verified mail address</h3>
          <div className="app__signin-main__input-container">
            <input type="text" className="app__signin-main__input" />
          </div>
        </main>
        <footer className="app__signin-footer">
          <button className="app__signin-submit">Submit</button>
        </footer>
      </div>
    </React.Fragment>
  );
};
