import { hooks } from "../../hooks/facade.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignIn(): JSX.Element {
  const login = hooks.useLogin();

  return <SignInLayout title="Sign In" onSubmit={login.signIn} loading={login.status == "doing"} />;
}
