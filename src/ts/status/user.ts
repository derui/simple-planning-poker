import { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { currentUserState } from "./signin-atom";

export interface UserActions {
  useChangeUserName: () => (name: string) => void;
}

export const createUserActions = (registrar: DependencyRegistrar<Dependencies>): UserActions => {
  const changeUserNameUseCase = registrar.resolve("changeUserNameUseCase");

  return {
    useChangeUserName: () => {
      const currentUser = useRecoilValue(currentUserState);

      return useRecoilCallback(({ set }) => async (name: string) => {
        if (!currentUser.id) {
          return;
        }

        await changeUserNameUseCase.execute({
          userId: currentUser.id,
          name,
        });

        set(currentUserState, () => ({ ...currentUser, name }));
      });
    },
  };
};
