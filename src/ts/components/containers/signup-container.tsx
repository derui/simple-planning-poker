import { signInActionContext } from "@/contexts/actions/signin-actions";
import { useAuthenticatingState } from "@/status/signin/selectors";
import { useLocation, useNavigate } from "solid-app-router";
import { Component, createEffect, ParentProps, useContext } from "solid-js";
import { SignInComponent } from "../presentations/signin";

interface Props {}

export const SignUpContainer: Component<ParentProps<Props>> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const action = useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signUp = action.useSignUp();
  const authenticating = useAuthenticatingState();

  const { from }: any = location.state || { from: { pathname: "/" } };
  const signInCallback = () => {
    navigate(from.pathname, { replace: true });
  };

  createEffect(() => {
    applyAuthenticated(signInCallback);
  });

  return (
    <SignInComponent
      title="Sign Up"
      onSubmit={(email, password) => signUp(email, password, signInCallback)}
      authenticating={authenticating}
    ></SignInComponent>
  );
};
