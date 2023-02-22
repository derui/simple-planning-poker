import { atomFamily } from "recoil";
import { Id } from "@/domains/user";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import AtomKeys from "./key";
import { UserRepository } from "@/domains/user-repository";
import { UserObserver } from "@/contexts/observer";

let userRepository: UserRepository | null = null;
let userObserver: UserObserver | null = null;

const userStateQuery = atomFamily({
  key: AtomKeys.userState,
  default: async (id: Id) => {
    const user = await userRepository!!.findBy(id);
    if (user) {
      return { id: user.id, name: user.name };
    }
    return undefined;
  },
  effects: (userId: Id) => [
    ({ setSelf }) => {
      const unsubscribe = userObserver!!.subscribe(userId, (user) => {
        setSelf({ id: user.id, name: user.name });
      });

      return unsubscribe;
    },
  ],
});

export default userStateQuery;

export const initializeUserQuery = (registrar: ApplicationDependencyRegistrar) => {
  userRepository = registrar.resolve("userRepository");
  userObserver = registrar.resolve("userObserver");
};
