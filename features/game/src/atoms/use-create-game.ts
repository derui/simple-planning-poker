import { useLoginUser } from "@spp/feature-login";
import { User } from "@spp/shared-domain";
import { CreateGameUseCase } from "@spp/shared-use-case";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { CreateGameError, createGameErrorsAtom, createGameStatusAtom } from "./game-atom.js";
import { CreateGameStatus } from "./type.js";

/**
 * Hook definition to create game
 */
export type UseCreateGame = () => {
  status?: CreateGameStatus;

  /**
   * errors while creating game
   */
  errors: CreateGameError[];

  /**
   * Create game with inputs. If this method failed, update status.
   *
   * @param callback Callback after a game is created
   */
  create: (name: string, points: string, callback?: (gameId: string) => void) => void;
};

// hook implementations
export const useCreateGame: UseCreateGame = () => {
  const [status, setStatus] = useAtom(createGameStatusAtom);
  const { userId, checkLoggedIn } = useLoginUser();
  const [errors, setErrors] = useAtom(createGameErrorsAtom);
  const create = useCallback(
    (name: string, points: string, callback?: (gameId: string) => void) => {
      if (!userId) {
        return;
      }

      setErrors([]);
      setStatus(CreateGameStatus.Waiting);

      const _do = async function _do(userId: User.Id) {
        const ret = await CreateGameUseCase({
          createdBy: userId,
          name,
          points: points
            .split(",")
            .filter((v) => v.trim() !== "")
            .map((v) => Number(v)),
        });
        console.log(ret);

        switch (ret.kind) {
          case "success":
            setStatus(CreateGameStatus.Completed);
            callback?.(ret.game.id);
            break;
          case "error":
            switch (ret.detail) {
              case "invalidName":
                setErrors(["InvalidName"]);
                setStatus(CreateGameStatus.Failed);
                return;
              case "conflictName":
                setErrors(["NameConflicted"]);
                setStatus(CreateGameStatus.Failed);
                return;
              case "invalidStoryPoints":
                setErrors(["InvalidPoints"]);
                setStatus(CreateGameStatus.Failed);
                return;
              case "failed":
                setStatus(CreateGameStatus.Failed);
                return;
            }
        }
      };

      _do(userId).catch(() => {
        setStatus(CreateGameStatus.Failed);
      });
    },
    [userId]
  );

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return {
    status,
    errors,
    create,
  };
};
