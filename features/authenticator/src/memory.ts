import { User, UserRepository } from "@spp/shared-domain";
import { Authenticator } from "./type.js";

/**
 * In memory version authenticator
 */
export class MemoryAuthenticator implements Authenticator {
  constructor(private userRepository: UserRepository.T) {}
  async signIn(email: string, password: string): Promise<User.Id> {
    try {
      const userId = User.createId(`${email}/${password}`);
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
      const userId = User.createId(`${email}/${password}`);
      const user = User.create({ id: userId, name });
      await this.userRepository.save(user);

      return userId;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async currentUserIdIfExists(): Promise<User.Id | undefined> {
    return Promise.resolve(undefined);
  }
}
