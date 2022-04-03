import { AtomKeys } from "./key";
import { atomFamily, RecoilState } from "recoil";
import { UserId } from "@/domains/user";
import { ApplicationDependencyRegistrar } from "@/dependencies";

export interface UserViewModel {
  id: string;
  name: string;
}

export const setUpAtomsUser = (
  registrar: ApplicationDependencyRegistrar
): {
  userState: (id: UserId) => RecoilState<UserViewModel | undefined>;
} => {
  const userRepository = registrar.resolve("userRepository");
  const userObserver = registrar.resolve("userObserver");

  const userState = atomFamily({
    key: AtomKeys.user,
    default: (id: UserId) =>
      userRepository.findBy(id).then((user): UserViewModel | undefined => {
        if (user) {
          return { id: user.id, name: user.name };
        }
      }),
    effects_UNSTABLE: (userId: UserId) => [
      ({ setSelf }) => {
        const unsubscribe = userObserver.subscribe(userId, (user) => {
          setSelf({ id: user.id, name: user.name });
        });

        return unsubscribe;
      },
    ],
  });

  return {
    userState,
  };
};
