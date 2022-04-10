import signInActionContext from "@/contexts/actions/signin-actions";
import { useAuthenticatingState } from "@/status/signin/selectors";
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
  const authenticating = useAuthenticatingState();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    navigate(from.pathname, { replace: true });
  };

  React.useEffect(() => {
    applyAuthenticated(signInCallback);
  }, []);

  return (
    <SignInComponent
      title="Sign Up"
      onSubmit={(email, password) => signUp(email, password, signInCallback)}
      showOverlay={authenticating}
    ></SignInComponent>
  );
};
