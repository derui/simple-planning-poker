import { AtomKeys } from "./key";
import { atomFamily, RecoilState } from "recoil";
import { UserRepository } from "~/src/ts/domains/user-repository";
import { UserId } from "~/src/ts/domains/user";
import { UserObserver } from "~/src/ts/contexts/observer";

export interface UserViewModel {
  id: string;
  name: string;
}

export const setUpAtomsUser = (
  userRepository: UserRepository,
  userObserver: UserObserver
): {
  userState: (id: UserId) => RecoilState<UserViewModel | undefined>;
} => {
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
