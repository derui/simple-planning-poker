import { User } from "@spp/shared-domain";

/**
 * An authenticator for user signin/up
 */
export interface Authenticator {
  /**
   * Get logined user id or not
   */
  currentUserIdIfExists(): Promise<User.Id | undefined>;

  /**
   * Sign in with email and password
   */
  signIn(email: string, password: string): Promise<User.Id | undefined>;

  /**
   * Sign up with name, email and password
   */
  signUp(name: string, email: string, password: string): Promise<User.Id | undefined>;
}
