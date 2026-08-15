import { Game } from "@spp/shared-domain";
import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";
import {
  commandProgressionAtom,
  currentGameAtom,
  deleteCurrentGameAtom,
  loadGameAtom,
  startVotingAtom,
} from "./game-atom.js";

/**
 * Hook definition to list game
 */
export type UseCurrentGame = () => {
  readonly loading: boolean;

  /**
   * current selected game.
   */
  readonly game?: GameDto;

  /**
   * requesting to select game.
   */
  readonly select: (gameId: string) => void;

  /**
   * Delete current selected game.
   */
  readonly delete: () => void;

  /**
   * Start voting for the current game.
   */
  readonly startVoting: (callback?: (votingId: string) => void) => void;
};

/**
 * Create hook implementation of `CurrentGame`
 */
export const useCurrentGame: UseCurrentGame = () => {
  const loadGame = useSetAtom(loadGameAtom);
  const deleteGame = useSetAtom(deleteCurrentGameAtom);
  const startVoting = useSetAtom(startVotingAtom);
  const deleting = useAtomValue(commandProgressionAtom);
  const game = useAtomValue(currentGameAtom);

  const _game = useMemo(() => {
    if (game.state == "hasData" && game.data) {
      return toGameDto(game.data);
    } else {
      return;
    }
  }, [game]);
  const loading = game.state == "loading" || deleting;

  const _delete = useCallback(() => {
    void deleteGame();
  }, [deleteGame]);

  const select = useCallback(
    (gameId: string) => {
      void loadGame(Game.createId(gameId));
    },
    [loadGame]
  );

  const _startVoting = useCallback(
    (callback?: (votingId: string) => void) => {
      void startVoting(callback || (() => {}));
    },
    [startVoting]
  );

  return {
    loading,
    game: _game,
    select,
    delete: _delete,
    startVoting: _startVoting,
  };
};
