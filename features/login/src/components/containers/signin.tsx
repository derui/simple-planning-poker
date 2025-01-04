import { useCallback } from "react";
import { useLocation } from "wouter";
import { hooks } from "../../hooks/facade.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignIn(): JSX.Element {
  const login = hooks.useLogin();
  const [, navigate] = useLocation();

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return <SignInLayout title="Sign In" onSubmit={login.signIn} onBack={handleBack} loading={login.status == "doing"} />;
}
