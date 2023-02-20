import { Dependencies } from "@/dependencies";
import { DependencyRegistrar } from "@/utils/dependency-registrar";
import { useRecoilCallback, useRecoilValue } from "recoil";
import currentUserState from "../atoms/current-user-state";

export default function createUseChangeUserName(registrar: DependencyRegistrar<Dependencies>) {
  const changeUserNameUseCase = registrar.resolve("changeUserNameUseCase");

  return () => {
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
  };
}
