import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { createGameAtom, gameCreatingAtom, gameCreationErrorAtom } from "./game-atom.js";
import { CreateGameError } from "./type.js";

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
  const loading = useAtomValue(gameCreatingAtom);
  const errors = useAtomValue(gameCreationErrorAtom);
  const createGame = useSetAtom(createGameAtom);
  const create = useCallback((name: string, points: string) => {
    createGame({
      name,
      points,
    });
  }, []);

  return {
    loading,
    errors,
    create,
  };
};
