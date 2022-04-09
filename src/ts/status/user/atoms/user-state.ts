import { atomFamily } from "recoil";
import { UserId } from "@/domains/user";
import { ApplicationDependencyRegistrar } from "@/dependencies";
import AtomKeys from "./key";

export default function createUserState(registrar: ApplicationDependencyRegistrar) {
  const userRepository = registrar.resolve("userRepository");
  const userObserver = registrar.resolve("userObserver");

  return atomFamily({
    key: AtomKeys.userState,
    default: async (id: UserId) => {
      const user = await userRepository.findBy(id);
      if (user) {
        return { id: user.id, name: user.name };
      }
      return undefined;
    },
    effects: (userId: UserId) => [
      ({ setSelf }) => {
        const unsubscribe = userObserver.subscribe(userId, (user) => {
          setSelf({ id: user.id, name: user.name });
        });

        return unsubscribe;
      },
    ],
  });
}
