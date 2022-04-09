import signInActionContext from "@/contexts/actions/signin-actions";
import authenticatingState from "@/status/signin/selectors/authenticating";
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
      title="Sign Up"
      onSubmit={(email, password) => signUp(email, password, signInCallback)}
      showOverlay={authenticating}
    ></SignInComponent>
  );
};
