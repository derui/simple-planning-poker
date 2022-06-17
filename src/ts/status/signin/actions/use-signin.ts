import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { setCurrentUserState } from "@/status/user/atoms/current-user-state";
import { setSignInState } from "../atoms/signin-state";

export const createUseSignIn = function (registrar: DependencyRegistrar<Dependencies>) {
  const authenticator = registrar.resolve("authenticator");
  const userRepository = registrar.resolve("userRepository");

  return () => async (email: string, password: string, callback: () => void) => {
    setSignInState((prev) => ({ ...prev, authenticating: true }));
    try {
      const userId = await authenticator.signIn(email, password);
      const user = await userRepository.findBy(userId);
      if (!user) {
        return;
      }

      setSignInState((prev) => ({ ...prev, authenticated: true }));
      setCurrentUserState({ id: userId, name: user.name, joinedGames: [] });
      callback();
    } catch (e) {
      throw e;
    } finally {
      setSignInState((prev) => ({ ...prev, authenticating: false }));
    }
  };
};
