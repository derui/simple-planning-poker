import { User } from "@spp/shared-domain";

/**
 * An authenticator for user signin/up
 */
export interface Authenticator {
  /**
   * Get logined user id or not
   */
  currentUserIdIfExists: Authenticator.CurrentUserIdIfExists;

  /**
   * Sign in with email and password
   */
  signIn: Authenticator.SignIn;

  /**
   * Sign up with name, email and password
   */
  signUp: Authenticator.SignUp;
}

/**
 * Default Authenticator. User must use real implementation instead.
 */
export const Authenticator: Authenticator = {
  currentUserIdIfExists: () => {
    throw new Error("Function not implemented.");
  },
  signIn: () => {
    throw new Error("Function not implemented.");
  },
  signUp: () => {
    throw new Error("Function not implemented.");
  },
};

/**
 * Structured type for Authenticator
 */
export namespace Authenticator {
  export namespace CurrentUserIdIfExists {
    export type Params = undefined;
    export type Result = User.Id | undefined;
  }
  export type CurrentUserIdIfExists = (params: CurrentUserIdIfExists.Params) => Promise<CurrentUserIdIfExists.Result>;

  export namespace SignIn {
    export type Params = {
      email: string;
      password: string;
    };
    export type Result = User.Id | undefined;
  }
  export type SignIn = (params: SignIn.Params) => Promise<SignIn.Result>;

  export namespace SignUp {
    export type Params = {
      name: string;
      email: string;
      password: string;
    };
    export type Result = User.Id | undefined;
  }
  export type SignUp = (params: SignUp.Params) => Promise<SignUp.Result>;
}
