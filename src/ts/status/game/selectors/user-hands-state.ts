import { GamePlayerId } from "@/domains/game-player";
import { selector, useRecoilValue } from "recoil";
import currentGameState from "../atoms/current-game-state";
import { GameViewModel, UserHandViewModel } from "../types";
import SelectorKeys from "./key";

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

const state = selector<State>({
  key: SelectorKeys.userHandsState,
  get: ({ get }) => {
    const game = get(currentGameState);
    if (!game) {
      return { upperLine: [], lowerLine: [] };
    }
    const upperUsers = game.hands.filter((_, index) => index % 2 == 0).map((v) => v.gamePlayerId);
    const upperLine = makeUserHandsInGame(game, upperUsers);
    const lowerUsers = game.hands.filter((_, index) => index % 2 == 1).map((v) => v.gamePlayerId);

    const lowerLine = makeUserHandsInGame(game, lowerUsers);

    return { upperLine, lowerLine };
  },
});

export default function userHandsState() {
  return useRecoilValue(state);
}
