import { signInActionContext } from "@/contexts/actions";
import { signInSelectors } from "@/status/signin";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { SignInComponent } from "../presentations/signin";

interface Props {}

export const SignUpContainer: React.FunctionComponent<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const action = React.useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signUp = action.useSignUp();
  const setEmail = action.useUpdateEmail();
  const setPassword = action.useUpdatePassword();
  const emailState = signInSelectors.useSignInEmail();
  const passwordState = signInSelectors.useSignInPassword();
  const authenticating = signInSelectors.useAuthenticating();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    navigate(from, { replace: true });
  };

  React.useEffect(() => applyAuthenticated(signInCallback), []);

  return (
    <SignInComponent
      title="Sign Up"
      onUpdateEmail={setEmail}
      onUpdatePassword={setPassword}
      onSubmit={() => signUp(emailState, passwordState, signInCallback)}
      showOverlay={authenticating}
    ></SignInComponent>
  );
};
