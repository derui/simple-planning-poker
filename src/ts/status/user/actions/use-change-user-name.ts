import { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { currentUserState, setCurrentUserState } from "../atoms/current-user-state";

export const createUseChangeUserName = function createUseChangeUserName(registrar: DependencyRegistrar<Dependencies>) {
  const changeUserNameUseCase = registrar.resolve("changeUserNameUseCase");

  return () => {
    return async (name: string) => {
      const currentUser = currentUserState();

      if (!currentUser.id) {
        return;
      }

      await changeUserNameUseCase.execute({
        userId: currentUser.id,
        name,
      });

      setCurrentUserState({ ...currentUser, name });
    };
  };
};
