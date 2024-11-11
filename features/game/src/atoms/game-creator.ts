import { UseLoginUser } from "@spp/feature-login";
import { GameRepository, User } from "@spp/shared-domain";
import { CreateGameUseCase } from "@spp/shared-use-case";
import { useAtom, useSetAtom } from "jotai";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, GameStatus, gameStatusAtom, selectedGameAtom } from "./game-atom.js";

/**
 * Hook definition to edit game
 */
export type UseGameCreator = () => {
  loading: boolean;

  /**
   * current selected game.
   */
  game?: GameDto;

  /**
   * create new game
   */
  create: (name: string, points: string) => void;
};

/**
 * Create hook implementation of `UseGameCreator`
 */
export const createUseGameCreator = function createUseGameCreator({
  gameRepository,
  useLoginUser,
  createGameUseCase,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
  createGameUseCase: CreateGameUseCase;
}): UseGameCreator {
  return () => {
    const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
    const { userId } = useLoginUser();
    const [game, setGame] = useAtom(selectedGameAtom);
    const setGames = useSetAtom(gamesAtom);
    const loading = gameStatus == GameStatus.Creating;

    return {
      loading,
      game: game ? toGameDto(game) : undefined,

      create: (name: string, points: string): void => {
        if (!game || !userId || loading) {
          return;
        }

        const _do = async () => {
          try {
            const ret = await createGameUseCase({
              name,
              points: points.split(",").map((v) => parseInt(v)),
              createdBy: userId,
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
            setGameStatus(GameStatus.Detail);
          }
        };

        setGameStatus(GameStatus.Creating);
        _do();
      },
    };
  };
};
