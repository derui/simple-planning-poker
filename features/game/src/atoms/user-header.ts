import { UseLoginUser } from "@spp/feature-login";
import { User, UserRepository, VoterType } from "@spp/shared-domain";
import { ChangeDefaultVoterTypeUseCase, ChangeUserNameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { VoterMode } from "../components/type.js";
import { toUserDto, UserDto } from "./dto.js";

type UserHeaderStatus = "loading" | "loaded" | "editing" | "edited";
const statusAtom = atom<UserHeaderStatus>("loading");
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
export type UseUserHeader = () => {
  readonly status: UserHeaderStatus;

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
export const createUseUserHeader = function createUseUserHeader({
  useLoginUser,
  userRepository,
  changeUserNameUseCase,
  changeDefaultVoterModeUseCase,
}: {
  useLoginUser: UseLoginUser;
  userRepository: UserRepository.T;
  changeUserNameUseCase: ChangeUserNameUseCase;
  changeDefaultVoterModeUseCase: ChangeDefaultVoterTypeUseCase;
}): UseUserHeader {
  return () => {
    const [status, setStatus] = useAtom(statusAtom);
    const [loginUser, setLoginUser] = useAtom(loginUserAtom);
    const { userId } = useLoginUser();
    const voterMode = useAtomValue(voterModeAtom);

    useEffect(() => {
      setStatus("loading");

      if (userId) {
        userRepository
          .findBy(userId)
          .then((user) => {
            setLoginUser(user);
          })
          .catch(() => setLoginUser(undefined))
          .finally(() => setStatus("loaded"));
      }
    }, [userId, setStatus, setLoginUser]);

    return {
      status: status,
      loginUser: loginUser ? toUserDto(loginUser) : undefined,
      voterMode,
      editName: (newName: string) => {
        if (!loginUser) {
          return;
        }

        setStatus("editing");
        changeUserNameUseCase({
          userId: loginUser.id,
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
            setStatus("edited");
          });
      },

      changeDefaultVoterMode: (newMode: VoterMode): void => {
        if (!loginUser) {
          return;
        }

        const voterType = newMode == VoterMode.Inspector ? VoterType.Inspector : VoterType.Normal;

        setStatus("editing");
        changeDefaultVoterModeUseCase({
          userId: loginUser.id,
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
            setStatus("edited");
          });
      },
    };
  };
};
