import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { commandProgressionAtom, createGameAtom, gameCreationErrorAtom } from "./game-atom.js";
import { CreateGameError } from "./type.js";
import { loginUserAtom } from "./user-atom.js";

/**
 * Hook definition to create game
 */
export type UseCreateGame = (created: () => void) => {
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
export const useCreateGame: UseCreateGame = (created) => {
  const commandProgression = useAtomValue(commandProgressionAtom);
  const user = useAtomValue(loginUserAtom);
  const errors = useAtomValue(gameCreationErrorAtom);
  const createGame = useSetAtom(createGameAtom);

  const loading = useMemo(() => {
    return commandProgression || !user;
  }, [commandProgression, user]);

  const create = useCallback(
    (name: string, points: string) => {
      createGame(
        {
          name,
          points,
        },
        created
      );
    },
    [created]
  );

  return {
    loading,
    errors,
    create,
  };
};
