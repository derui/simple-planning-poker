import { useEffect } from "react";
import { AuthStatus } from "../../atoms/use-auth.js";
import { hooks } from "../../hooks/facade.js";
import { LoginLayout } from "./login.layout.js";

// eslint-disable-next-line func-style
export function Login(): JSX.Element {
  const { status, checkLogined } = hooks.useAuth();

  useEffect(() => {
    checkLogined();
  }, [checkLogined]);

  return <LoginLayout authenticating={status == AuthStatus.Checking} />;
}
