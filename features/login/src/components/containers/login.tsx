import { AuthStatus } from "../../atoms/type.js";
import { hooks } from "../../hooks/facade.js";
import { LoginLayout } from "./login.layout.js";

// eslint-disable-next-line func-style
export function Login(): JSX.Element {
  const { status } = hooks.useAuth();

  return <LoginLayout authenticating={status == AuthStatus.Checking} />;
}
