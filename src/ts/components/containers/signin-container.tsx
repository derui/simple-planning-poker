import { signInActionContext } from "@/contexts/actions/signin-actions";
import { useSignInSelectors } from "@/contexts/selectors/signin-selectors";
import { Link, useLocation, useNavigate } from "solid-app-router";
import { Component, createRenderEffect, useContext } from "solid-js";
import { SignInComponent } from "../presentations/signin";

export const SignInContainer: Component = () => {
  const { authenticating } = useSignInSelectors();
  const navigate = useNavigate();
  const location = useLocation();
  const action = useContext(signInActionContext);
  const applyAuthenticated = action.useApplyAuthenticated();
  const signIn = action.useSignIn();

  const signInCallback = () => () => {
    navigate(location.query["from"] || "/", { replace: true });
  };

  const onSubmit = () => (email: string, password: string) => {
    signIn(email, password, signInCallback());
  };

  createRenderEffect(() => {
    applyAuthenticated(signInCallback());
  });

  return (
    <SignInComponent title="Sign In" onSubmit={onSubmit()} authenticating={authenticating()}>
      <p class="app__signin-main__sign-up-link">
        or <Link href="/signup">Sign up</Link>
      </p>
    </SignInComponent>
  );
};
