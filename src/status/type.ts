import * as User from "@/domains/user";

export interface Authenticator {
  currentUserIdIfExists(): Promise<User.Id | undefined>;
  signIn(email: string, password: string): Promise<User.Id | undefined>;
  signUp(name: string, email: string, password: string): Promise<User.Id | undefined>;
}
