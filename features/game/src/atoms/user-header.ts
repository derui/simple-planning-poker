import { UseLoginUser } from "@spp/feature-login";
import { User, UserRepository } from "@spp/shared-domain";
import { ChangeUserNameUseCase } from "@spp/shared-use-case";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { VoterMode } from "../components/type.js";
import { toUserDto, UserDto } from "./dto.js";

type UserHeaderStatus = "loading" | "loaded" | "editing" | "edited";
const statusAtom = atom<UserHeaderStatus>("loading");
const loginUserAtom = atom<User.T | undefined>(undefined);

/**
 * Hook definition to list game
 */
export type UseUserHeader = () => {
  readonly status: UserHeaderStatus;

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
export const createUseUserHeader = function createUseUserHeader({
  useLoginUser,
  userRepository,
  changeUserNameUseCase,
}: {
  useLoginUser: UseLoginUser;
  userRepository: UserRepository.T;
  changeUserNameUseCase: ChangeUserNameUseCase;
}): UseUserHeader {
  return () => {
    const [status, setStatus] = useAtom(statusAtom);
    const [loginUser, setLoginUser] = useAtom(loginUserAtom);
    const { userId } = useLoginUser();

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

      changeDefaultVoterMode: (newMode: VoterMode) => {
        if (!loginUser) {
          return;
        }

        console.warn("TODO: changeDefaultVoterMode");
      },
    };
  };
};
