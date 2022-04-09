import { UserId } from "@/domains/user";
import { useRecoilCallback } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import signInState from "../atoms/signing";
import currentUserState from "../atoms/current-user";

export interface Authenticator {
  signIn(email: string, password: string): Promise<UserId>;

  signUp(name: string, email: string, password: string): Promise<UserId>;

  currentUserIdIfExists(): Promise<UserId | undefined>;
}

const createUseSignIn = (registrar: DependencyRegistrar<Dependencies>) => {
  const authenticator = registrar.resolve("authenticator");
  const userRepository = registrar.resolve("userRepository");

  return () =>
    useRecoilCallback(({ set }) => async (email: string, password: string, callback: () => void) => {
      set(signInState, (prev) => ({ ...prev, authenticating: true }));
      try {
        const userId = await authenticator.signIn(email, password);
        const user = await userRepository.findBy(userId);
        if (!user) {
          return;
        }

        set(currentUserState, () => ({ id: userId, name: email, joinedGames: [] }));
        callback();
      } catch (e) {
        throw e;
      } finally {
        set(signInState, (prev) => ({ ...prev, authenticating: false }));
      }
    });
};

export default createUseSignIn;
