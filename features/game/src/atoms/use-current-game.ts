import { useLoginUser } from "@spp/feature-login";
import { Game } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/mock/game-repository";
import { DeleteGameUseCase } from "@spp/shared-use-case";
import { atom, useAtom, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useCallback, useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";

/**
 * An atom to store selected game
 */
const selectedGameIdAtom = atom<string | undefined>(undefined);
const asyncSelectedGameAtom = atom<Promise<Game.T | undefined>>(async (get) => {
  const id = get(selectedGameIdAtom);

  if (!id) {
    return undefined;
  }

  return await GameRepository.findBy({ id: Game.createId(id) });
});

const selectedGameAtom = loadable(asyncSelectedGameAtom);

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
  const setSelectedId = useSetAtom(selectedGameIdAtom);
  const { userId } = useLoginUser();
  const [game] = useAtom(selectedGameAtom);
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
          setSelectedId(undefined);
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
    setSelectedId(gameId);
  }, []);

  return {
    loading,
    game: _game,
    select,
    delete: _delete,
  };
};
