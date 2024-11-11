import { UseLoginUser } from "@spp/feature-login";
import { Game, GameRepository, User } from "@spp/shared-domain";
import { DeleteGameUseCase } from "@spp/shared-use-case";
import { useAtom, useSetAtom } from "jotai";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, GameStatus, gameStatusAtom, selectedGameAtom } from "./game-atom.js";

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
   * requesting edit current selected game.
   */
  requestEdit: () => void;

  /**
   * Delete current selected game.
   */
  delete: () => void;
};

/**
 * Create hook implementation of `UseGameDetail`
 */
export const createUseGameDetail = function createUseGameDetail({
  gameRepository,
  useLoginUser,
  deleteGameUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  deleteGameUseCase: DeleteGameUseCase;
}): UseGameDetail {
  return () => {
    const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
    const { userId } = useLoginUser();
    const [game, setGame] = useAtom(selectedGameAtom);
    const setGames = useSetAtom(gamesAtom);
    const loading = gameStatus == GameStatus.Deleting;

    return {
      loading,
      game: game ? toGameDto(game) : undefined,

      requestEdit: (): void => {
        if (!game || !userId) {
          return;
        }

        setGameStatus(GameStatus.Edit);
      },

      delete: () => {
        if (!game || !userId || loading) {
          return;
        }

        const _do = async () => {
          try {
            const ret = await deleteGameUseCase({ gameId: Game.createId(game.id), ownedBy: User.createId(userId) });

            if (ret.kind == "success") {
              setGame(undefined);
              setGames(await gameRepository.listUserCreated(User.createId(userId)));
            }
          } catch (err) {
            console.error(err);
          } finally {
            setGameStatus(GameStatus.Detail);
          }
        };

        setGameStatus(GameStatus.Deleting);
        _do();
      },
    };
  };
};
