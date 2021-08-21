import firebase from "firebase";
import { Authenticator } from "../status/signin";
import { createUserId, UserId } from "../domains/user";

export class FirebaseAuthenticator implements Authenticator {
  constructor(private auth: firebase.auth.Auth, private database: firebase.database.Database) {}

  async authenticate(email: string): Promise<UserId> {
    const ref = await this.database.ref("defined-users").get();
    let existsMail = false;
    ref.forEach((snapshot) => {
      if (existsMail) {
        return;
      }
      existsMail = snapshot.key === email;
    });

    if (existsMail) {
      throw new Error("Do not allow login the email");
    }

    try {
      const auth = await this.auth.signInAnonymously();
      const uid = auth.user!.uid;
      await this.database.ref(`authenticated/${uid}`).set(email);
    } catch (e) {
      console.error(e);
      throw e;
    }

    return createUserId();
  }
}
