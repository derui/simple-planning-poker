import { useLoginUser } from "@spp/feature-login";
import { Game, User } from "@spp/shared-domain";
import { DeleteGameUseCase } from "@spp/shared-use-case";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, selectedGameAtom } from "./game-atom.js";

/**
 * Hook definition to list game
 */
export type UseCurrentGame = () => {
  loading: boolean;

  /**
   * current selected game.
   */
  game?: GameDto;

  /**
   * requesting to select game.
   */
  select: (gameId: string) => void;

  /**
   * Delete current selected game.
   */
  delete: () => void;
};

/**
 * Current game status.
 */
enum CurrentGameStatus {
  NotSelect,
  Selected,
  Deleting,
}

/**
 * Create hook implementation of `UseGameDetail`
 */
export const useCurrentGame: UseCurrentGame = () => {
  const [state, setState] = useState(CurrentGameStatus.NotSelect);
  const { userId } = useLoginUser();
  const [game, setGame] = useAtom(selectedGameAtom);
  const games = useAtomValue(gamesAtom);
  const loading = state == CurrentGameStatus.Deleting;
  const _delete = useCallback(() => {
    if (!game || !userId || loading) {
      return;
    }

    const _do = async () => {
      try {
        const ret = await DeleteGameUseCase({ gameId: Game.createId(game.id), ownedBy: User.createId(userId) });

        if (ret.kind == "success") {
          setGame(undefined);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setState(CurrentGameStatus.NotSelect);
      }
    };

    setState(CurrentGameStatus.Deleting);
    _do();
  }, [game, userId, loading]);

  const select = useCallback(
    (gameId: string) => {
      const game = games.find((g) => g.id === gameId);

      setGame(game);
      if (game) {
        setState(CurrentGameStatus.Selected);
      }
    },
    [games]
  );

  return {
    loading,
    game: game ? toGameDto(game) : undefined,
    select,
    delete: _delete,
  };
};
