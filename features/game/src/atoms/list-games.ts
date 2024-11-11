import { UseLoginUser } from "@spp/feature-login";
import { GameRepository } from "@spp/shared-domain";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, GameStatus, gameStatusAtom, selectedGameAtom } from "./game-atom.js";

const loadingAtom = atom<"completed" | "loading" | "creating">("loading");

/**
 * Hook definition to list game
 */
export type UseListGames = () => {
  status: "completed" | "loading" | "creating";

  /**
   * Current joined/owned games
   */
  games: GameDto[];

  /**
   * Selected game
   */
  selectedGame?: GameDto;

  /**
   * Select game.
   *
   * @param gameId Id of the game to select.
   */
  select: (gameId: string) => void;

  /**
   * Request to create a new game.
   */
  requestCreate: () => void;
};

/**
 * Create hook implementation of `UseListGame`
 */
export const createUseListGames = function createUseListGames({
  gameRepository,
  useLoginUser,
}: {
  gameRepository: GameRepository.T;
  useLoginUser: UseLoginUser;
}): UseListGames {
  return () => {
    const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);
    const [status, setStatus] = useAtom(loadingAtom);
    const [games, setGames] = useAtom(gamesAtom);
    const [selectedGame, setSelectedGame] = useAtom(selectedGameAtom);
    const { userId } = useLoginUser();

    useEffect((): void => {
      setStatus("loading");
      if (userId) {
        gameRepository
          .listUserCreated(userId)
          .then((games) => {
            setGames(games);
            setStatus("completed");
          })
          .catch(() => {
            setGames([]);
          });
      }
    }, [userId, setGames, setStatus]);

    return {
      status,
      selectedGame: selectedGame ? toGameDto(selectedGame) : undefined,

      games: !userId ? [] : games.map((v) => toGameDto(v)),

      select: (gameId: string): void => {
        if (gameStatus != GameStatus.Detail) {
          return;
        }
        setSelectedGame(games.find((v) => v.id === gameId));
      },

      requestCreate: (): void => {
        setGameStatus(GameStatus.Create);
        setStatus("creating");
      },
    };
  };
};
