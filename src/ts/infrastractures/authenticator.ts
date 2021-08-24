import firebase from "firebase";
import { Authenticator } from "../status/signin";
import { createUser, createUserId, UserId } from "../domains/user";
import { UserRepository } from "@/domains/user-repository";

const localKey = "authenticated/uid";

export class FirebaseAuthenticator implements Authenticator {
  constructor(
    private auth: firebase.auth.Auth,
    private database: firebase.database.Database,
    private userRepository: UserRepository
  ) {}
  async authenticate(email: string): Promise<UserId> {
    const authenticatedUid = localStorage.getItem(localKey);
    if (authenticatedUid) {
      return createUserId(authenticatedUid);
    }

    const ref = await this.database.ref("defined-users").once("value");
    const mails = (ref.val() as string[] | null) || [];
    let existsMail = mails.some((v) => v === email);

    if (!existsMail) {
      throw new Error("Do not allow login the email");
    }

    const isSignedIn = await this.database.ref(`authenticated/${email}`).once("value");
    if (isSignedIn.val()) {
      throw new Error(`${email} is already signed in`);
    }

    try {
      const auth = await this.auth.signInAnonymously();
      const uid = auth.user!.uid;
      localStorage.setItem(localKey, uid);
      this.database.ref(`authenticated/${email}`).set(true);

      const userId = createUserId(uid);
      const user = createUser(userId, email);
      this.userRepository.save(user);

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAuthenticatedUser(): Promise<UserId | undefined> {
    const val = localStorage.getItem(localKey);

    return val ? (val as UserId) : undefined;
  }
}
