import { GamePlayerId } from "@/domains/game-player";
import { Future, pendingOf, valueOf } from "@/status/util";
import { createMemo } from "solid-js";
import { GameViewModel, UserHandViewModel } from "../types";
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

const userHandsState = createMemo<Future<State>>(() => {
  const game = currentGameState().valueMaybe()?.viewModel;
  if (!game) {
    return pendingOf();
  }
  const upperUsers = game.hands.filter((_, index) => index % 2 == 0).map((v) => v.gamePlayerId);
  const upperLine = makeUserHandsInGame(game, upperUsers);
  const lowerUsers = game.hands.filter((_, index) => index % 2 == 1).map((v) => v.gamePlayerId);

  const lowerLine = makeUserHandsInGame(game, lowerUsers);

  return valueOf({ upperLine, lowerLine });
});

export { userHandsState };
