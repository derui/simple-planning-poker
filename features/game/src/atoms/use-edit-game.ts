import { useLoginUser } from "@spp/feature-login";
import { Game } from "@spp/shared-domain";
import { EditGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { EditGameError } from "./game-atom.js";

/**
 * An atom to store validation
 */
const editGameErrorsAtom = atom<EditGameError[]>([]);

/**
 * loading state of editing game
 */
const editingGameAtom = atom<boolean>(false);

/**
 * Hook definition to edit game
 */
export type UseEditGame = () => {
  loading: boolean;

  /**
   * errors of edit game
   */
  errors: EditGameError[];

  /**
   * edit game with given game id, name and points
   */
  edit: (gameId: Game.Id, name: string, points: string) => void;
};

/**
 * Create hook implementation of `UseGameEditor`
 */
export const useEditGame: UseEditGame = () => {
  const { userId, checkLoggedIn } = useLoginUser();
  const [loading, setLoading] = useAtom(editingGameAtom);
  const [errors, setErrors] = useAtom(editGameErrorsAtom);
  const edit = useCallback(
    (gameId: Game.Id, name: string, points: string): void => {
      if (!userId || loading) {
        return;
      }

      const _do = async () => {
        try {
          const ret = await EditGameUseCase({
            gameId,
            name,
            points: points.split(",").map((v) => parseInt(v)),
            ownedBy: userId,
          });

          switch (ret.kind) {
            case "success":
              break;
            case "error":
              {
                switch (ret.detail) {
                  case "notFound":
                    setErrors(["NotFound"]);
                    break;
                  case "conflictName":
                    setErrors(["NameConflicted"]);
                    break;
                  case "invalidStoryPoint":
                    setErrors(["InvalidPoints"]);
                    break;
                  case "invalidName":
                    setErrors(["InvalidName"]);
                    break;
                }
              }
              break;
            default:
              break;
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      setLoading(true);
      _do();
    },
    [userId, loading]
  );

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  return {
    loading,
    errors,
    edit,
  };
};
