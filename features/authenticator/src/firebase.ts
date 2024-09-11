import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { User, UserRepository } from "@spp/shared-domain";
import { Authenticator } from "./type.js";

export class FirebaseAuthenticator implements Authenticator {
  constructor(
    private auth: Auth,
    private userRepository: UserRepository.T
  ) {}
  async signIn(email: string, password: string): Promise<User.Id> {
    try {
      const auth = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = auth.user.uid;

      const userId = User.createId(uid);
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

  async signUp(name: string, email: string, password: string): Promise<User.Id> {
    try {
      const auth = await createUserWithEmailAndPassword(this.auth, email, password);
      const uid = auth.user.uid;

      const userId = User.createId(uid);
      const user = User.create({ id: userId, name });
      this.userRepository.save(user);

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async currentUserIdIfExists(): Promise<User.Id | undefined> {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          const uid = user.uid;
          resolve(User.createId(uid));
        } else {
          resolve(undefined);
        }
      });
    });
  }
}
