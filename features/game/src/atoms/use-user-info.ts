import { useLoginUser } from "@spp/feature-login";
import { User, VoterType } from "@spp/shared-domain";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { ChangeDefaultVoterTypeUseCase, ChangeUserNameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { VoterMode } from "../components/type.js";
import { toUserDto, UserDto } from "./dto.js";

const statusAtom = atom<boolean>(false);
const loginUserAtom = atom<User.T | undefined>(undefined);
const voterModeAtom = atom<VoterMode | undefined>((get) => {
  const user = get(loginUserAtom);

  if (!user) {
    return;
  }
  const voterType = user.defaultVoterType;
  if (voterType === VoterType.Normal) {
    return VoterMode.Normal;
  }
  if (voterType === VoterType.Inspector) {
    return VoterMode.Inspector;
  }
});

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
  const [loading, setLoading] = useAtom(statusAtom);
  const [loginUser, setLoginUser] = useAtom(loginUserAtom);
  const { userId } = useLoginUser();
  const voterMode = useAtomValue(voterModeAtom);

  useEffect(() => {
    setLoading(true);

    if (userId) {
      UserRepository.findBy({ id: userId })
        .then((user) => {
          setLoginUser(user);
        })
        .catch(() => setLoginUser(undefined))
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const editName = useCallback(
    (newName: string) => {
      if (!userId) {
        return;
      }

      setLoading(true);
      ChangeUserNameUseCase({
        userId,
        name: newName,
      })
        .then((ret) => {
          switch (ret.kind) {
            case "success":
              setLoginUser(ret.user);
              break;
            default:
              setLoginUser(undefined);
              break;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [userId]
  );

  const changeDefaultVoterMode = useCallback(
    (newMode: VoterMode) => {
      if (!userId) {
        return;
      }

      const voterType = newMode == VoterMode.Inspector ? VoterType.Inspector : VoterType.Normal;

      setLoading(true);
      ChangeDefaultVoterTypeUseCase({
        userId: userId,
        voterType,
      })
        .then((ret) => {
          switch (ret.kind) {
            case "success":
              setLoginUser(ret.user);
              break;
            default:
              setLoginUser(undefined);
              break;
          }
        })
        .finally(() => {
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
