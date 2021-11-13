import { Authenticator } from "../status/signin";
import { createUser, createUserId, UserId } from "../domains/user";
import { UserRepository } from "@/domains/user-repository";
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { Database, get, ref } from "firebase/database";

export class FirebaseAuthenticator implements Authenticator {
  constructor(private auth: Auth, private database: Database, private userRepository: UserRepository) {}
  async signIn(email: string, password: string): Promise<UserId> {
    await this.checkToAllowSigningUserWith(email);

    try {
      const auth = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = auth.user.uid;

      const userId = createUserId(uid);
      const user = await this.userRepository.findBy(userId);
      if (!user) {
        throw Error("Not found user");
      }

      return user.id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async signUp(name: string, email: string, password: string): Promise<UserId> {
    await this.checkToAllowSigningUserWith(email);

    try {
      const auth = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = auth.user.uid;

      const userId = createUserId(uid);
      const user = createUser({ id: userId, name, joinedGames: [] });
      this.userRepository.save(user);

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  private async checkToAllowSigningUserWith(email: string) {
    const definedUser = await get(ref(this.database, "defined-users"));
    const mails = (definedUser.val() as string[] | null) || [];
    const existsMail = mails.some((v) => v === email);

    if (!existsMail) {
      throw new Error("Do not allow login the email");
    }
  }

  async currentUserIdIfExists(): Promise<UserId | undefined> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          const uid = user.uid;
          resolve(createUserId(uid));
        } else {
          resolve(undefined);
        }
      });
    });
  }
}
