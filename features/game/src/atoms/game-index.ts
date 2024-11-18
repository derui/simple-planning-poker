import { useAtomValue } from "jotai";
import { GameStatus, gameStatusAtom } from "./game-atom.js";

/**
 * Hook definition to list game
 */
export type UseGameIndex = () => {
  /**
   * Status of this page
   */
  status: GameStatus;
};

/**
 * Create hook implementation of `UseGameIndex`
 */
export const createUseGameIndex = function createUseGameIndex(): UseGameIndex {
  return () => {
    const gameStatus = useAtomValue(gameStatusAtom);

    return {
      status: gameStatus,
    };
  };
};
