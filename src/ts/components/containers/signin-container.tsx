import { signInActionContext } from "@/contexts/actions";
import { signInSelectors } from "@/status/signin";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import { SignInComponent } from "../presentations/signin";

interface Props extends RouteComponentProps {}

export const SignInContainer: React.FunctionComponent<Props> = ({ location, history }) => {
  const action = React.useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signIn = action.useSignIn();
  const setEmail = action.useUpdateEmail();
  const setPassword = action.useUpdatePassword();
  const emailState = signInSelectors.useSignInEmail();
  const passwordState = signInSelectors.useSignInPassword();
  const authenticating = signInSelectors.useAuthenticating();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    history.replace(from);
  };

  React.useEffect(() => applyAuthenticated(signInCallback), []);

  return (
    <SignInComponent
      title="Sign In"
      onUpdateEmail={setEmail}
      onUpdatePassword={setPassword}
      onSubmit={() => signIn(emailState, passwordState, signInCallback)}
      showOverlay={authenticating}
    >
      <p className="app__signin-main__sign-up-link">
        or <a href="/signup">Sign up</a>
      </p>
    </SignInComponent>
  );
};
