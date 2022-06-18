import { signInActionContext } from "@/contexts/actions/signin-actions";
import { useAuthenticatingState } from "@/status/signin/selectors";
import { useLocation, useNavigate } from "solid-app-router";
import { Component, createEffect, useContext } from "solid-js";
import { SignInComponent } from "../presentations/signin";

export const SignInContainer: Component = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const action = useContext(signInActionContext);
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

  createEffect(() => {
    applyAuthenticated(signInCallback);
  });

  return (
    <SignInComponent title="Sign In" onSubmit={onSubmit} authenticating={authenticating}>
      <p class="app__signin-main__sign-up-link">
        or <a href="/signup">Sign up</a>
      </p>
    </SignInComponent>
  );
};
