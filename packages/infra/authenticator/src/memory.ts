import { User, UserRepository } from "@spp/shared-domain";
import { Authenticator } from "./type.js";

/**
 * In memory version authenticator
 */
export const newMemoryAuthenticator = function newMemoryAuthenticator(
  userRepository: UserRepository.T,
  loginedUser?: User.Id
): Authenticator {
  return {
    async signIn(email: string, password: string): Promise<User.Id | undefined> {
      try {
        const userId = User.createId(`${email}/${password}`);
        const user = await userRepository.findBy(userId);
        if (!user) {
          return;
        }

        return user.id;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async signUp(name: string, email: string, password: string): Promise<User.Id | undefined> {
      try {
        const userId = User.createId(`${email}/${password}`);
        const user = User.create({ id: userId, name });

        if (await userRepository.findBy(userId)) {
          return;
        }

        await userRepository.save(user);

        return userId;
      } catch (e) {
        console.error(e);
        throw e;
      }
    },

    async currentUserIdIfExists(): Promise<User.Id | undefined> {
      return Promise.resolve(loginedUser);
    },
  };
};
