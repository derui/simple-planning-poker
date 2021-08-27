import { ChangeUserNameUseCase } from "@/usecases/change-user-name";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { currentUserState } from "./signin-atom";

export interface UserActions {
  useChangeUserName: () => (name: string) => void;
}

export const createUserActions = (changeUserNameUseCase: ChangeUserNameUseCase): UserActions => {
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
