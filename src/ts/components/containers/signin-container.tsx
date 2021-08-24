import { signInActionContext } from "@/contexts/actions";
import { signInSelectors } from "@/status/signin";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import classnames from "classnames";

interface Props extends RouteComponentProps {}

const Overlay = () => {
  const authenticating = signInSelectors.useAuthenticating();
  const authenticated = signInSelectors.useAuthenticated();

  const classes = {
    "app__signin-overlay": true,
    "app__signin-overlay--show": authenticating && !authenticated,
  };

  return <div className={classnames(classes)}></div>;
};

export const SigninContainer: React.FunctionComponent<Props> = ({ location, history }) => {
  const action = React.useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signIn = action.useSignIn();
  const setSignInState = action.useUpdateEmail();
  const signInState = signInSelectors.useSignInEmail();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    history.replace(from);
  };

  React.useEffect(() => applyAuthenticated(signInCallback));

  return (
    <React.Fragment>
      <Overlay />
      <div className="app__signin-root">
        <header className="app__signin-header">Sign in</header>
        <main className="app__signin-main">
          <h3 className="app__signin-main__description">Sign in with verified mail address</h3>
          <div className="app__signin-main__input-container">
            <input type="text" className="app__signin-main__input" onChange={(e) => setSignInState(e.target.value)} />
          </div>
        </main>
        <footer className="app__signin-footer">
          <button className="app__signin-submit" onClick={() => signIn(signInState, signInCallback)}>
            Submit
          </button>
        </footer>
      </div>
    </React.Fragment>
  );
};
