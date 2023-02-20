import { useRecoilCallback } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentUserState from "@/status/user/atoms/current-user-state";
import signInState from "../atoms/signin-state";

export default function createUseSignUp(registrar: DependencyRegistrar<Dependencies>) {
  const authenticator = registrar.resolve("authenticator");
  const userRepository = registrar.resolve("userRepository");

  return () =>
    useRecoilCallback(({ set }) => async (email: string, password: string, callback: () => void) => {
      set(signInState, (prev) => ({ ...prev, authenticating: true }));
      try {
        const userId = await authenticator.signUp(email, email, password);
        const user = await userRepository.findBy(userId);
        if (!user) {
          return;
        }

        set(signInState, (prev) => ({ ...prev, authenticated: true }));
        set(currentUserState, () => ({ id: userId, name: user.name, joinedGames: [] }));
        callback();
      } catch (e) {
        throw e;
      } finally {
        set(signInState, (prev) => ({ ...prev, authenticating: false }));
      }
    });
}
