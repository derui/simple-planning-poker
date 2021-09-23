import { signInActionContext } from "@/contexts/actions";
import { signInSelectors } from "@/status/signin";
import * as React from "react";
import { CSSTransition } from "react-transition-group";
import { RouteComponentProps } from "react-router";

interface Props extends RouteComponentProps {}

const Overlay = () => {
  const authenticating = signInSelectors.useAuthenticating();
  const showOverlay = authenticating;

  return (
    <CSSTransition in={showOverlay} timeout={200} classNames="app__signin-overlay" tran>
      <div className="app__signin-overlay"></div>
    </CSSTransition>
  );
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

  React.useEffect(() => applyAuthenticated(signInCallback), []);

  return (
    <React.Fragment>
      <Overlay />
      <form
        className="app__signin-root"
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          signIn(signInState, signInCallback);
        }}
      >
        <header className="app__signin-header">Sign in</header>
        <main className="app__signin-main">
          <h3 className="app__signin-main__description">Sign in with verified mail address</h3>
          <div className="app__signin-main__input-container">
            <input type="text" className="app__signin-main__input" onChange={(e) => setSignInState(e.target.value)} />
          </div>
        </main>
        <footer className="app__signin-footer">
          <input type="submit" className="app__signin__submit" value="Submit" />
        </footer>
      </form>
    </React.Fragment>
  );
};
