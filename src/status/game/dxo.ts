import { T } from "@/domains/game-player";
import { GamePlayerViewModel } from "./types";

export const gamePlayerToViewModel = (gamePlayer: T, userName: string): GamePlayerViewModel => {
  return {
    id: gamePlayer.id,
    userId: gamePlayer.user,
    name: userName,
    mode: gamePlayer.mode,
    hand: gamePlayer.hand,
  };
};
