import { GamePlayer } from "@/domains/game-player";
import { GamePlayerViewModel } from "./game-atom";

export const gamePlayerToViewModel = (gamePlayer: GamePlayer): GamePlayerViewModel => {
  return {
    id: gamePlayer.id,
    userId: gamePlayer.user,
    mode: gamePlayer.mode,
    hand: gamePlayer.hand,
  };
};
