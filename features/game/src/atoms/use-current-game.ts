import { useLoginUser } from "@spp/feature-login";
import { Game } from "@spp/shared-domain";
import { DeleteGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { currentGameAtom, loadGameAtom, resetGameAtom } from "./game-atom.js";

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
};

/**
 * Current game status.
 */
enum CurrentGameStatus {
  NotSelect = "not select",
  Selecting = "selecting",
  Selected = "selected",
  Deleting = "deleting",
}

const currentGameStatusAtom = atom(CurrentGameStatus.NotSelect);

/**
 * Create hook implementation of `CurrentGame`
 */
export const useCurrentGame: UseCurrentGame = () => {
  const [state, setStatus] = useAtom(currentGameStatusAtom);
  const loadGame = useSetAtom(loadGameAtom);
  const resetGame = useSetAtom(resetGameAtom);
  const { userId } = useLoginUser();
  const [game] = useAtom(currentGameAtom);
  const _game = useMemo(() => {
    if (game.state == "hasData" && game.data) {
      return toGameDto(game.data);
    } else {
      return;
    }
  }, [game]);
  const loading = userId === undefined || state == CurrentGameStatus.Deleting;

  const _delete = useCallback(() => {
    if (!_game || !userId || loading) {
      return;
    }

    const _do = async () => {
      try {
        const ret = await DeleteGameUseCase({ gameId: Game.createId(_game.id), ownedBy: userId });

        if (ret.kind == "success") {
          resetGame();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setStatus(CurrentGameStatus.NotSelect);
      }
    };

    setStatus(CurrentGameStatus.Deleting);
    new Promise(async (r) => {
      await _do();
      r(undefined);
    });
  }, [_game, userId, loading]);

  const select = useCallback(async (gameId: string) => {
    setStatus(CurrentGameStatus.Selecting);
    loadGame(Game.createId(gameId));
  }, []);

  return {
    loading,
    game: _game,
    select,
    delete: _delete,
  };
};
