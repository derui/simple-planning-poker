import { Game } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { commandProgressionAtom, editGameAtom, gameEditingErrorAtom } from "./game-atom.js";
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
  edit: (gameId: Game.Id, name: string, points: string) => void;
};

/**
 * Create hook implementation of `UseGameEditor`
 */
export const useEditGame: UseEditGame = () => {
  const loading = useAtomValue(commandProgressionAtom);
  const errors = useAtomValue(gameEditingErrorAtom);
  const editGame = useSetAtom(editGameAtom);
  const edit = useCallback(
    (gameId: Game.Id, name: string, points: string): void => {
      editGame({ gameId, name, points });
    },
    [editGame]
  );

  return {
    loading,
    errors,
    edit,
  };
};
