import { Authenticator } from "../status/signin";
import { createUser, createUserId, UserId } from "../domains/user";
import { UserRepository } from "@/domains/user-repository";
import { Auth, signInAnonymously } from "firebase/auth";
import { Database, get, ref, set } from "firebase/database";

const localKey = "authenticated/uid";

export class FirebaseAuthenticator implements Authenticator {
  constructor(private auth: Auth, private database: Database, private userRepository: UserRepository) {}
  async authenticate(email: string): Promise<UserId> {
    const authenticatedUid = localStorage.getItem(localKey);
    if (authenticatedUid) {
      this.checkUserIsAuthenticated(authenticatedUid);
      return createUserId(authenticatedUid);
    }

    const definedUser = await get(ref(this.database, "defined-users"));
    const mails = (definedUser.val() as string[] | null) || [];
    let existsMail = mails.some((v) => v === email);

    if (!existsMail) {
      throw new Error("Do not allow login the email");
    }

    try {
      const auth = await signInAnonymously(this.auth);
      const uid = auth.user.uid;

      const isSignedIn = await get(ref(this.database, `authenticated/${uid}`));
      const emailSignedInAsUid = isSignedIn.val();
      if (emailSignedInAsUid && emailSignedInAsUid !== email) {
        throw new Error(`${email} is already signed in`);
      }

      localStorage.setItem(localKey, uid);
      set(ref(this.database, `authenticated/${uid}`), email);

      const userId = createUserId(uid);
      const user = createUser({ id: userId, name: email });
      this.userRepository.save(user);

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async checkUserIsAuthenticated(uidInStorage: string) {
    const auth = await signInAnonymously(this.auth);
    const uid = auth.user.uid;

    if (uidInStorage !== uid) {
      localStorage.removeItem(localKey);
      throw new Error("Need re-authentication");
    }

    const isSignedIn = await get(ref(this.database, `authenticated/${uid}`));
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
