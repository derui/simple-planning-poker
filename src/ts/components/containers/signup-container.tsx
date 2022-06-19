import { signInActionContext } from "@/contexts/actions/signin-actions";
import { useSignInSelectors } from "@/contexts/selectors/signin-selectors";
import { useNavigate } from "solid-app-router";
import { Component, createEffect, ParentProps, useContext } from "solid-js";
import { SignInComponent } from "../presentations/signin";

interface Props {}

export const SignUpContainer: Component<ParentProps<Props>> = () => {
  const { authenticating } = useSignInSelectors();
  const navigate = useNavigate();
  const action = useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signUp = action.useSignUp();

  const signInCallback = () => {
    navigate("/", { replace: true });
  };

  createEffect(() => {
    applyAuthenticated(signInCallback);
  });

  return (
    <SignInComponent
      title="Sign Up"
      onSubmit={(email, password) => signUp(email, password, signInCallback)}
      authenticating={authenticating()}
    ></SignInComponent>
  );
};
