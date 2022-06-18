import { signInActionContext } from "@/contexts/actions/signin-actions";
import { useSignInSelectors } from "@/contexts/selectors/signin-selectors";
import { useLocation, useNavigate } from "solid-app-router";
import { Component, createMemo, createRenderEffect, useContext } from "solid-js";
import { SignInComponent } from "../presentations/signin";

export const SignInContainer: Component = () => {
  const { authenticating } = useSignInSelectors();
  const location = useLocation<{ from: string }>();
  const navigate = useNavigate();
  const action = useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signIn = action.useSignIn();
  const state = createMemo(() => location.state?.from ?? "/");

  const signInCallback = () => {
    navigate(state(), { replace: true });
  };

  const onSubmit = (email: string, password: string) => {
    signIn(email, password, signInCallback);
  };

  createRenderEffect(() => {
    applyAuthenticated(signInCallback);
  });

  return (
    <SignInComponent title="Sign In" onSubmit={onSubmit} authenticating={authenticating()}>
      <p class="app__signin-main__sign-up-link">
        or <a href="/signup">Sign up</a>
      </p>
    </SignInComponent>
  );
};
