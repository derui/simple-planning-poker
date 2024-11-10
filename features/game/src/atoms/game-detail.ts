import { GameRepository } from "@spp/shared-domain";
import { atom, useAtom, useAtomValue } from "jotai";
import { GameDto, toGameDto } from "./dto.js";
import { selectedGameAtom } from "./game-atom.js";

const statusAtom = atom<"editing" | "completed">("completed");

/**
 * Hook definition to list game
 */
export type UseGameDetail = () => {
  loading: boolean;

  /**
   * current selected game.
   */
  game?: GameDto;

  /**
   * edit current selected game.
   *
   * @param name Name of the game to edit.
   * @param points Points of the game to edit.
   */
  edit: (name: string, points: string) => void;

  /**
   * Delete current selected game.
   */
  delete: () => void;
};

/**
 * Create hook implementation of `UseListGame`
 */
export const useGameDetail = function useGameDetail({
  gameRepository,
}: {
  gameRepository: GameRepository.T;
}): UseGameDetail {
  return () => {
    const [status, setStatus] = useAtom(statusAtom);
    const game = useAtomValue(selectedGameAtom);

    return {
      loading: status == "editing",
      game: game ? toGameDto(game) : undefined,

      edit: (name: string, points: string): void => {
        if (!game) {
          return;
        }
      },

      delete: () => {
        throw new Error("Not implemented");
      },
    };
  };
};
