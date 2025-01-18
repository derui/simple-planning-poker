import { useCallback } from "react";
import { useLocation } from "wouter";
import { useLogin } from "../../atoms/use-login.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignIn(): JSX.Element {
  const login = useLogin();
  const [, navigate] = useLocation();

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return <SignInLayout title="Sign In" onSubmit={login.signIn} onBack={handleBack} loading={login.status == "doing"} />;
}
