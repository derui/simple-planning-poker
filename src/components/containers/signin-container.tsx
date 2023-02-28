import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { SignIn } from "../presentations/signin";
import { useAuthenticatingState } from "@/status/signin/selectors";
import signInActionContext from "@/contexts/actions/signin-actions";

interface Props {}

const SignInContainer: React.FunctionComponent<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const action = React.useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signIn = action.useSignIn();
  const authenticating = useAuthenticatingState();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    navigate(from.pathname, { replace: true });
  };

  const onSubmit = (email: string, password: string) => {
    signIn(email, password, signInCallback);
  };

  React.useEffect(() => {
    applyAuthenticated(signInCallback);
  }, []);

  return (
    <SignIn title="Sign In" onSubmit={onSubmit} authenticating={authenticating}>
      <p className="app__signin-main__sign-up-link">
        or <a href="/signup">Sign up</a>
      </p>
    </SignIn>
  );
};

export default SignInContainer;
