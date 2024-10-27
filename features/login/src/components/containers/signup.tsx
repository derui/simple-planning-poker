import * as Url from "@spp/shared-app-url";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hooks } from "../../hooks/facade.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignUp() {
  const login = hooks.useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (login.status == "logined") {
      navigate(Url.gameIndexPage());
    }
  }, [login.status]);

  return <SignInLayout title="Sign Up" onSubmit={login.signUp} loading={login.status == "doing"} />;
}
