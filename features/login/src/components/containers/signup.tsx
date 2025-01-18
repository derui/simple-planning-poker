import { useCallback } from "react";
import { useLocation } from "wouter";
import { useLogin } from "../../atoms/use-login.js";
import { SignInLayout } from "./signin.layout.js";

// eslint-disable-next-line func-style
export function SignUp(): JSX.Element {
  const login = useLogin();

  const [, navigate] = useLocation();

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return <SignInLayout title="Sign Up" onSubmit={login.signUp} onBack={handleBack} loading={login.status == "doing"} />;
}
