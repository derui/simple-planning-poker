import * as Url from "@spp/shared-app-url";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthStatus } from "../../atoms/atom.js";
import { hooks } from "../../hooks/facade.js";
import { LoginLayout } from "./login.layout.js";

// eslint-disable-next-line func-style
export function Login(): JSX.Element {
  const { status, checkLogined } = hooks.useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkLogined();
  }, []);

  if (status == AuthStatus.Authenticated) {
    navigate(Url.gameIndexPage(), { replace: true });
  }

  return <LoginLayout authenticating={status == AuthStatus.Checking} />;
}
