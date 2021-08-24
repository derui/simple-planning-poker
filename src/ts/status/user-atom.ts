import { AtomKeys } from "./key";
import { atomFamily, RecoilState } from "recoil";
import { UserRepository } from "@/domains/user-repository";
import { User, UserId } from "@/domains/user";

export const setUpAtomsUser = (
  userRepository: UserRepository
): {
  userState: (id: UserId) => RecoilState<User | undefined>;
} => {
  const userState = atomFamily({
    key: AtomKeys.user,
    default: (id: UserId) => userRepository.findBy(id),
  });

  return {
    userState,
  };
};
