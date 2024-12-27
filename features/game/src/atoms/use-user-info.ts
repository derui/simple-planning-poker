import { useLoginUser } from "@spp/feature-login";
import { User, VoterType } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { ChangeUserNameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { VoterMode } from "../components/type.js";
import { toUserDto, UserDto } from "./dto.js";
import { editUserNameAtom, loadUserAtom, loginUserAtom } from "./user-atom.js";

const voterModeAtom = atom<VoterMode | undefined>((get) => {
  const user = get(loginUserAtom);

  if (user.state != 'hasData' || !user.data) {
    return;
  }
  
  const voterType = user.data.defaultVoterType;
  if (voterType === VoterType.Normal) {
    return VoterMode.Normal;
  }
  return VoterMode.Inspector;
});

const loadingAtom = atom<boolean>(false);

/**
 * Hook definition to list game
 */
export type UseUserInfo = () => {
  readonly loading: boolean;

  readonly loginUser?: UserDto;

  /**
   * current voter mode of current user
   */
  readonly voterMode?: VoterMode;

  /**
   * Edit name of current user
   */
  readonly editName: (newName: string) => void;

  /**
   *  Change default voter mode of current user
   */
  readonly changeDefaultVoterMode: (voterMode: VoterMode) => void;
};

/**
 * Create hook implementation of `UseListGame`
 */
export const useUserInfo: UseUserInfo = () => {
  const loadUser = useSetAtom(loadUserAtom);
  const loginUser = useAtomValue(loginUserAtom)
  const editUserName = useSetAtom(editUserNameAtom);
  const { userId } = useLoginUser();
  const voterMode = useAtomValue(voterModeAtom);

  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);

  const editName = useCallback(
    (newName: string) => {
      if (!loginUser || !User.canChangeName(newName)) {
        return;
      }

      editUserName(newName)
    },
    [userId]
  );

  const changeDefaultVoterMode = useCallback(
    (newMode: VoterMode) => {
      if (!userId) {
        return;
      }
      setLoading(true);

      (async () => {
      const voterType = newMode == VoterMode.Inspector ? VoterType.Inspector : VoterType.Normal;
      const user = await UserRepository.findBy({ id: userId });
      if (!user) {
        loadUser(undefined)
        return;
      }

      const newUser = User.changeDefaultVoterType(user, voterType);

      await UserRepository.save({ user: newUser });
      
      loadUser(newUser);
        
      })().finally({
        setLoading(false);
      });
    },
    [userId]
  );

  return {
    loading: loading,
    loginUser: loginUser ? toUserDto(loginUser) : undefined,
    voterMode,
    editName,
    changeDefaultVoterMode,
  };
};
