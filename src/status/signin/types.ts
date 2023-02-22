import { Id } from "@/domains/user";

export interface Authenticator {
  signIn(email: string, password: string): Promise<Id>;

  signUp(name: string, email: string, password: string): Promise<Id>;

  currentUserIdIfExists(): Promise<Id | undefined>;
}
