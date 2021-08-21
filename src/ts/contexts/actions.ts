import { UserId } from "@/domains/user";
import { Authenticator, createSigninActions, SigninActions } from "../status/signin";
import { createContext } from "react";

class DummyAuthenticator implements Authenticator {
  authenticate(email: string): Promise<UserId> {
    return Promise.resolve(email as UserId);
  }
}

// context for SignInAction.
export const signInActionContext = createContext<SigninActions>(createSigninActions(new DummyAuthenticator()));
