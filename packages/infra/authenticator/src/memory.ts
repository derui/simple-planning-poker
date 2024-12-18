import { User } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { type Authenticator as I } from "./base.js";

let loggedInUser: User.Id | undefined = undefined;

/**
 * Set logged user
 */
export const setLoggedUser = (userId: User.Id): void => {
  loggedInUser = userId;
};

/**
 * Reset logged user
 */
export const resetLoggedInUser = (): void => {
  loggedInUser = undefined;
};

/**
 * In memory version authenticator
 */
export const Authenticator: I = {
  async signIn({ email, password }): Promise<User.Id | undefined> {
    try {
      const userId = User.createId(`${email}/${password}`);
      const user = await UserRepository.findBy({ id: userId });
      if (!user) {
        return;
      }

      return user.id;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async signUp({ name, email, password }): Promise<User.Id | undefined> {
    try {
      const userId = User.createId(`${email}/${password}`);
      const user = User.create({ id: userId, name });

      if (await UserRepository.findBy({ id: userId })) {
        return;
      }

      await UserRepository.save({ user });

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async currentUserIdIfExists(): Promise<User.Id | undefined> {
    return loggedInUser;
  },
};
