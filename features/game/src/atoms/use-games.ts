import { useLoginUser } from "@spp/feature-login";
import { Game } from "@spp/shared-domain";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";

/**
 * games that are owned by or joined by an user
 */
const gamesAtom = atom<Game.T[]>([]);

const loadingAtom = atom<boolean>(false);

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
  const [loading, setLoading] = useAtom(loadingAtom);
  const [games, setGames] = useAtom(gamesAtom);
  const { userId } = useLoginUser();

  const gameValues = useMemo(() => {
    if (!userId) {
      return [];
    }

    const values = games.map((game) => toGameDto(game));
    return values;
  }, [userId, games]);

  useEffect((): void => {
    setLoading(true);
    if (userId) {
      GameRepository.listUserCreated({ user: userId })
        .then((games) => {
          setGames(games);
          setLoading(false);
        })
        .catch(() => {
          setGames([]);
        });
    }
  }, [userId]);

  return {
    loading,
    games: gameValues,
  };
};
