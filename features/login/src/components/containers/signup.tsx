import { hooks } from "../../hooks/facade.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignUp(): JSX.Element {
  const login = hooks.useLogin();

  return <SignInLayout title="Sign Up" onSubmit={login.signUp} loading={login.status == "doing"} />;
}
