import createUseApplyAuthenticated from "@/status/signin/actions/use-apply-authenticated";
import createUseSignIn from "@/status/signin/actions/use-signin";
import createUseSignUp from "@/status/signin/actions/use-signup";
import { createContext } from "react";

export interface SigninActions {
  useSignIn: ReturnType<typeof createUseSignIn>;
  useSignUp: ReturnType<typeof createUseSignUp>;
  useApplyAuthenticated: ReturnType<typeof createUseApplyAuthenticated>;
}

// context for SignInAction.
const signInActionContext = createContext<SigninActions>({} as SigninActions);

export default signInActionContext;
