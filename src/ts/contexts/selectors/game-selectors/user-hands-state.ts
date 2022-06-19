import { GamePlayerId } from "@/domains/game-player";
import { GameViewModel, UserHandViewModel } from "@/status/game/types";
import { createMemo } from "solid-js";
import { currentGameState } from "./current-game-state";

type State = {
  upperLine: UserHandViewModel[];
  lowerLine: UserHandViewModel[];
};

const makeUserHandsInGame = (game: GameViewModel, users: GamePlayerId[]) => {
  return users
    .map((user) => {
      return game.hands.find((v) => v.gamePlayerId === user);
    })
    .filter((v) => !!v)
    .map((v) => v!);
};

const userHandsState = () =>
  createMemo<State>(() => {
    const gameState = currentGameState();
    const game = gameState()?.viewModel;
    if (!game) {
      return { upperLine: [], lowerLine: [] };
    }
    const upperUsers = game.hands.filter((_, index) => index % 2 == 0).map((v) => v.gamePlayerId);
    const upperLine = makeUserHandsInGame(game, upperUsers);
    const lowerUsers = game.hands.filter((_, index) => index % 2 == 1).map((v) => v.gamePlayerId);

    const lowerLine = makeUserHandsInGame(game, lowerUsers);

    return { upperLine, lowerLine };
  });

export { userHandsState };
