import { User } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { VoterMode } from "../components/type.js";
import { toUserDto, UserDto } from "./dto.js";
import { changeDefaultVoterModeAtom, editUserNameAtom, loadUserAtom, loginUserAtom } from "./user-atom.js";

/**
 * Hook definition to list game
 */
export type UseUserInfo = () => {
  readonly loading: boolean;

  readonly loginUser?: UserDto;

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
  const loginUser = useAtomValue(loginUserAtom);
  const editUserName = useSetAtom(editUserNameAtom);
  const _changeDefaultVoterMode = useSetAtom(changeDefaultVoterModeAtom);

  const editName = useCallback((newName: string) => {
    if (!User.canChangeName(newName)) {
      return;
    }

    editUserName(newName);
  }, []);

  const changeDefaultVoterMode = useCallback((newMode: VoterMode) => {
    _changeDefaultVoterMode(newMode);
  }, []);

  return {
    loading: loginUser ? false : true,
    loginUser: loginUser ? toUserDto(loginUser) : undefined,
    editName,
    changeDefaultVoterMode,
  };
};
