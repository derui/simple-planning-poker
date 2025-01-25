import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { commandProgressionAtom, currentGameAtom, editGameAtom, gameEditingErrorAtom } from "./game-atom.js";
import { EditGameError } from "./type.js";

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
  edit: (name: string, points: string) => void;
};

/**
 * Create hook implementation of `UseGameEditor`
 */
export const useEditGame: UseEditGame = () => {
  const progression = useAtomValue(commandProgressionAtom);
  const current = useAtomValue(currentGameAtom);
  const errors = useAtomValue(gameEditingErrorAtom);
  const editGame = useSetAtom(editGameAtom);
  const edit = useCallback(
    (name: string, points: string): void => {
      editGame({ name, points });
    },
    [editGame]
  );

  const loading = useMemo(() => {
    return progression || current.state != "hasData";
  }, [progression, current]);

  return {
    loading,
    errors,
    edit,
  };
};
