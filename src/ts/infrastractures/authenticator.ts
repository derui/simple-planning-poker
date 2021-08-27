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
      this.checkUserIsAuthenticated(authenticatedUid);
      return createUserId(authenticatedUid);
    }

    const ref = await this.database.ref("defined-users").once("value");
    const mails = (ref.val() as string[] | null) || [];
    let existsMail = mails.some((v) => v === email);

    if (!existsMail) {
      throw new Error("Do not allow login the email");
    }

    try {
      const auth = await this.auth.signInAnonymously();
      const uid = auth.user!.uid;

      const isSignedIn = await this.database.ref(`authenticated/${uid}`).once("value");
      const emailSignedInAsUid = isSignedIn.val();
      if (emailSignedInAsUid && emailSignedInAsUid !== email) {
        throw new Error(`${email} is already signed in`);
      }

      localStorage.setItem(localKey, uid);
      this.database.ref(`authenticated/${uid}`).set(email);

      const userId = createUserId(uid);
      const user = createUser(userId, email);
      this.userRepository.save(user);

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async checkUserIsAuthenticated(uidInStorage: string) {
    const auth = await this.auth.signInAnonymously();
    const uid = auth.user!.uid;

    if (uidInStorage !== uid) {
      localStorage.removeItem(localKey);
      throw new Error("Need re-authentication");
    }

    const isSignedIn = await this.database.ref(`authenticated/${uid}`).once("value");
    if (!isSignedIn.val()) {
      localStorage.removeItem(localKey);
      throw new Error("Need re-authentication");
    }
  }

  async getAuthenticatedUser(): Promise<UserId | undefined> {
    const val = localStorage.getItem(localKey);

    return val ? (val as UserId) : undefined;
  }
}
