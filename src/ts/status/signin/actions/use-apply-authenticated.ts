import { useRecoilCallback } from "recoil";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import currentUserState from "@/status/user/atoms/current-user-state";
import signInState from "../atoms/signin-state";

export default function createUseApplyAuthenticated(registrar: DependencyRegistrar<Dependencies>) {
  const authenticator = registrar.resolve("authenticator");
  const userRepository = registrar.resolve("userRepository");

  return () =>
    useRecoilCallback(({ set }) => async (callback: () => void, errorCallback?: () => void) => {
      set(signInState, (prev) => ({ ...prev, authenticating: true }));
      const userId = await authenticator.currentUserIdIfExists();

      const user = await (userId ? userRepository.findBy(userId) : Promise.resolve(undefined));
      if (!user) {
        set(signInState, (prev) => ({ ...prev, authenticating: false }));
        if (errorCallback) {
          errorCallback();
        }
        return;
      }

      set(signInState, (prev) => ({ ...prev, authenticating: false, authenticated: true }));
      set(currentUserState, () => ({ id: user.id, name: user.name, joinedGames: [] }));
      callback();
    });
}
