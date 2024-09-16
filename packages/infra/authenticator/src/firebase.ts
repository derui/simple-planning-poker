import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { User, UserRepository } from "@spp/shared-domain";
import { Authenticator } from "./type.js";

/**
 * Get new instance of authenticator that is combined with Firebase.Auth
 */
export const newFirebaseAuthenticator = function newFirebaseAuthenticator(
  auth: Auth,
  userRepository: UserRepository.T
): Authenticator {
  return {
    async signIn(email: string, password: string): Promise<User.Id> {
      try {
        const authenticated = await signInWithEmailAndPassword(auth, email, password);
        const uid = authenticated.user.uid;

        const userId = User.createId(uid);
        const user = await userRepository.findBy(userId);
        if (!user) {
          throw Error("Not found user");
        }

        return user.id;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async signUp(name: string, email: string, password: string): Promise<User.Id> {
      try {
        const authenticated = await createUserWithEmailAndPassword(auth, email, password);
        const uid = authenticated.user.uid;

        const userId = User.createId(uid);
        const user = User.create({ id: userId, name });
        await userRepository.save(user);

        return userId;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async currentUserIdIfExists(): Promise<User.Id | undefined> {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
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
};
