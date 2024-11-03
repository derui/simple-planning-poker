import * as Url from "@spp/shared-app-url";
import { useNavigate } from "react-router-dom";
import { hooks } from "../../hooks/facade.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignIn(): JSX.Element {
  const login = hooks.useLogin();
  const navigate = useNavigate();

  if (login.status == "logined") {
    navigate(Url.gameIndexPage());
  }

  return <SignInLayout title="Sign In" onSubmit={login.signIn} loading={login.status == "doing"} />;
}
