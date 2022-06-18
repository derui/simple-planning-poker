import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";
import { setCurrentUserState } from "@/status/user/signals/current-user-state";
import { setSignInState } from "../signals/signin-state";
import { filterUndefined } from "@/utils/array";

export const createUseApplyAuthenticated = function (registrar: DependencyRegistrar<Dependencies>) {
  const authenticator = registrar.resolve("authenticator");
  const userRepository = registrar.resolve("userRepository");
  const gameRepository = registrar.resolve("gameRepository");

  return () => async (callback: () => void, errorCallback?: () => void) => {
    setSignInState((prev) => ({ ...prev, authenticating: true }));

    const userId = await authenticator.currentUserIdIfExists();

    const user = await (userId ? userRepository.findBy(userId) : Promise.resolve(undefined));
    if (!user) {
      setSignInState((prev) => ({ ...prev, authenticating: false }));
      if (errorCallback) {
        errorCallback();
      }
      return;
    }

    const joinedGames = await Promise.all(
      user.joinedGames.map(async (v) => {
        const game = await gameRepository.findBy(v.gameId);
        if (!game) {
          return;
        }

        return {
          id: game.id,
          name: game.name,
          playerId: v.playerId as string,
        };
      })
    );

    setSignInState((prev) => ({ ...prev, authenticating: false, authenticated: true }));
    setCurrentUserState((prev) => ({
      ...prev,
      id: user.id,
      name: user.name,
      joinedGames: filterUndefined(joinedGames),
    }));
    callback();
  };
};
