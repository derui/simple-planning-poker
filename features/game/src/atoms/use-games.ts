import { useLoginUser } from "@spp/feature-login";
import { GameRepository } from "@spp/shared-domain/game-repository";
import { atom, useAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { GameDto, toGameDto } from "./dto.js";
import { gamesAtom } from "./game-atom.js";

const loadingAtom = atom<"completed" | "loading" | "creating">("loading");

/**
 * Hook definition to list game
 */
export type UseGames = () => {
  status: "completed" | "loading" | "creating";

  /**
   * Current joined/owned games
   */
  games: GameDto[];
};

/**
 * Create hook implementation of `UseListGame`
 */
export const useGames: UseGames = () => {
  const [status, setStatus] = useAtom(loadingAtom);
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
    setStatus("loading");
    if (userId) {
      GameRepository.listUserCreated({ user: userId })
        .then((games) => {
          setGames(games);
          setStatus("completed");
        })
        .catch(() => {
          setGames([]);
        });
    }
  }, [userId]);

  return {
    status,
    games: gameValues,
  };
};
