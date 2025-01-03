import { useLoginUser } from "@spp/feature-login";
import { User, VoterType } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useMemo } from "react";
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
  const loginUser = useAtomValue(loginUserAtom);
  const editUserName = useSetAtom(editUserNameAtom);
  const _changeDefaultVoterMode = useSetAtom(changeDefaultVoterModeAtom);
  const { userId } = useLoginUser();
  const voterMode = useMemo(() => {
    if (!loginUser) {
      return VoterMode.Normal;
    }

    if (loginUser.defaultVoterType == VoterType.Normal) {
      return VoterMode.Normal;
    } else {
      return VoterMode.Inspector;
    }
  }, [loginUser]);

  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);

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
    voterMode,
    editName,
    changeDefaultVoterMode,
  };
};
