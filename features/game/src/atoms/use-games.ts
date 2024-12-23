import { useLoginUser } from "@spp/feature-login";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom, loadGamesAtom } from "./game-atom.js";

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
  const loadGames = useSetAtom(loadGamesAtom);
  const { userId } = useLoginUser();
  const loading = games.state == "loading";

  const gameValues = useMemo(() => {
    if (games.state == "hasData") {
      return games.data.map((game) => toGameDto(game));
    }

    return [];
  }, [userId, games]);

  useEffect((): void => {
    if (userId) {
      loadGames(userId);
    }
  }, [userId]);

  return {
    loading,
    games: gameValues,
  };
};
