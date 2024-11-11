import { UseLoginUser } from "@spp/feature-login";
import { GameRepository, User } from "@spp/shared-domain";
import { EditGameUseCase } from "@spp/shared-use-case";
import { useAtom, useSetAtom } from "jotai";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, GameStatus, gameStatusAtom, selectedGameAtom } from "./game-atom.js";

/**
 * Hook definition to edit game
 */
export type UseGameEditor = () => {
  loading: boolean;

  /**
   * current selected game.
   */
  game?: GameDto;

  /**
   * edit current selected game.
   */
  edit: (name: string, points: string) => void;
};

/**
 * Create hook implementation of `UseGameEditor`
 */
export const createUseGameEditor = function createUseGameEditor({
  gameRepository,
  useLoginUser,
  editGameUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  editGameUseCase: EditGameUseCase;
}): UseGameEditor {
  return () => {
    const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
    const { userId } = useLoginUser();
    const [game, setGame] = useAtom(selectedGameAtom);
    const setGames = useSetAtom(gamesAtom);
    const loading = gameStatus == GameStatus.Editing;

    return {
      loading,
      game: game ? toGameDto(game) : undefined,

      edit: (name: string, points: string): void => {
        if (!game || !userId || loading) {
          return;
        }

        const _do = async () => {
          try {
            const ret = await editGameUseCase({
              gameId: game.id,
              name,
              points: points.split(",").map((v) => parseInt(v)),
              ownedBy: userId,
            });

            switch (ret.kind) {
              case "success":
                setGame(ret.game);
                setGames(await gameRepository.listUserCreated(User.createId(userId)));
                break;
              default:
                break;
            }
          } catch (err) {
            console.error(err);
          } finally {
            setGameStatus(GameStatus.Selected);
          }
        };

        setGameStatus(GameStatus.Editing);
        _do();
      },
    };
  };
};
