import { AtomKeys } from "./key";
import { atomFamily, RecoilState } from "recoil";
import { UserRepository } from "@/domains/user-repository";
import { User, UserId } from "@/domains/user";
import { UserObserver } from "@/contexts/observer";

export const setUpAtomsUser = (
  userRepository: UserRepository,
  userObserver: UserObserver
): {
  userState: (id: UserId) => RecoilState<User | undefined>;
} => {
  const userState = atomFamily({
    key: AtomKeys.user,
    default: (id: UserId) => userRepository.findBy(id),
    effects_UNSTABLE: (userId: UserId) => [
      ({ setSelf }) => {
        const unsubscribe = userObserver.subscribe(userId, (user) => {
          setSelf(user);
        });

        return unsubscribe;
      },
    ],
  });

  return {
    userState,
  };
};
