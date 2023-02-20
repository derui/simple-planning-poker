import { UserId } from "@/domains/user";

export interface Authenticator {
  signIn(email: string, password: string): Promise<UserId>;

  signUp(name: string, email: string, password: string): Promise<UserId>;

  currentUserIdIfExists(): Promise<UserId | undefined>;
}
