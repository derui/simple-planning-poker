import { useLoginUser } from "@spp/feature-login";
import { User } from "@spp/shared-domain";
import { CreateGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback } from "react";
import { loadGamesAtom } from "./game-atom.js";
import { CreateGameError } from "./type.js";

/**
 * An atom to store validation
 */
const createGameErrorsAtom = atom<CreateGameError[]>([]);

const loadingAtom = atom<boolean>(false);

/**
 * Hook definition to create game
 */
export type UseCreateGame = () => {
  /**
   * loading status of creating game
   */
  loading: boolean;

  /**
   * errors while creating game
   */
  errors: CreateGameError[];

  /**
   * Create game with inputs. If this method failed, update status.
   *
   * @param callback Callback after a game is created
   */
  create: (name: string, points: string) => void;
};

// hook implementations
export const useCreateGame: UseCreateGame = () => {
  const [loading, setLoading] = useAtom(loadingAtom);
  const { userId } = useLoginUser();
  const [errors, setErrors] = useAtom(createGameErrorsAtom);
  const loadGames = useSetAtom(loadGamesAtom);
  const create = useCallback(
    (name: string, points: string) => {
      if (!userId || loading) {
        return;
      }

      setErrors([]);
      setLoading(true);

      const _do = async function _do(userId: User.Id) {
        const ret = await CreateGameUseCase({
          createdBy: userId,
          name,
          points: points
            .split(",")
            .filter((v) => v.trim() !== "")
            .map((v) => Number(v)),
        });

        switch (ret.kind) {
          case "success":
            loadGames(userId);
            break;
          case "error":
            switch (ret.detail) {
              case "invalidName":
                setErrors(["InvalidName"]);
                return;
              case "conflictName":
                setErrors(["NameConflicted"]);
                return;
              case "invalidStoryPoints":
                setErrors(["InvalidPoints"]);
                return;
              case "failed":
                return;
            }
        }
      };

      _do(userId).finally(() => {
        setLoading(false);
      });
    },
    [userId, loading]
  );

  return {
    loading,
    errors,
    create,
  };
};
