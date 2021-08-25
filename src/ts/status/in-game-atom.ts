import { AtomKeys, SelectorKeys } from "./key";
import { atom, RecoilState, RecoilValueReadOnly, selector } from "recoil";
import { Game, GameId } from "@/domains/game";

export const setUpAtomsInGame = (): {
  gameStateQuery: RecoilValueReadOnly<Game | undefined>;
  currentGameState: RecoilState<Game | undefined>;
} => {
  const currentGameState = atom<Game | undefined>({
    key: AtomKeys.currentGameState,
    default: undefined,
  });

  const gameStateQuery = selector({
    key: SelectorKeys.inGameCurrentGame,
    get: ({ get }) => get(currentGameState),
  });

  return {
    gameStateQuery,
    currentGameState,
  };
};
