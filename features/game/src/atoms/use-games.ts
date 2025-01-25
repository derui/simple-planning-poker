import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom } from "./game-atom.js";

/**
 * Hook definition to list game
 */
export type UseGames = () => {
  loading: boolean;

  /**
   * Current joined/owned games
   */
  games: GameDto[];
};

/**
 * Create hook implementation of `UseListGame`
 */
export const useGames: UseGames = () => {
  const games = useAtomValue(gamesAtom);
  const loading = games.state == "loading";

  const gameValues = useMemo(() => {
    if (games.state == "hasData") {
      return games.data.map((game) => toGameDto(game));
    }

    return [];
  }, [games]);

  return {
    loading,
    games: gameValues,
  };
};
