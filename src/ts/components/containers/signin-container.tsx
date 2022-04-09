import signInActionContext from "@/contexts/actions/signin-actions";
import authenticatingState from "@/status/signin/selectors/authenticating";
import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import { SignInComponent } from "../presentations/signin";

interface Props {}

export const SignInContainer: React.FunctionComponent<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const action = React.useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signIn = action.useSignIn();
  const authenticating = authenticatingState();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    navigate(from, { replace: true });
  };

  React.useEffect(() => {
    applyAuthenticated(signInCallback);
  }, []);

  return (
    <SignInComponent
      title="Sign In"
      onSubmit={(email, password) => signIn(email, password, signInCallback)}
      showOverlay={authenticating}
    >
      <p className="app__signin-main__sign-up-link">
        or <a href="/signup">Sign up</a>
      </p>
    </SignInComponent>
  );
};
