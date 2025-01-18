import { AuthStatus } from "../../atoms/type.js";
import { useAuth } from "../../atoms/use-auth.js";
import { LoginLayout } from "./login.layout.js";

// eslint-disable-next-line func-style
export function Login(): JSX.Element {
  const { status } = useAuth();

  return <LoginLayout authenticating={status == AuthStatus.Checking} />;
}
