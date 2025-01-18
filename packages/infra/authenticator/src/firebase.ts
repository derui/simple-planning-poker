import { User } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { type Authenticator as I } from "./base.js";

/**
 * Set instance of Firebase.Auth
 */
export const setAuth = function setAuth(auth: Auth): void {
  _auth = auth;
};

/**
 * Instance of authenticator that is combined with Firebase.Auth
 */
export const Authenticator: I = {
  async signIn({ email, password }): Promise<User.Id> {
    try {
      const authenticated = await signInWithEmailAndPassword(_auth, email, password);
      const uid = authenticated.user.uid;

      const userId = User.createId(uid);
      const user = await UserRepository.findBy({ id: userId });
      if (!user) {
        throw Error("Not found user");
      }

      return user.id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async signUp({ name, email, password }): Promise<User.Id> {
    try {
      const authenticated = await createUserWithEmailAndPassword(_auth, email, password);
      const uid = authenticated.user.uid;

      const userId = User.createId(uid);
      const user = User.create({ id: userId, name });
      await UserRepository.save({ user });

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async currentUserIdIfExists(): Promise<User.Id | undefined> {
    return new Promise((resolve) => {
      onAuthStateChanged(_auth, (user) => {
        if (user) {
          const uid = user.uid;
          resolve(User.createId(uid));
        } else {
          resolve(undefined);
        }
      });
    });
  },
};
