import { AtomKeys, SelectorKeys } from "./key";
import { atom, atomFamily, RecoilState, RecoilValueReadOnly, selector } from "recoil";
import { Game, GameId } from "@/domains/game";
import { GameRepository } from "@/domains/game-repository";

export const setUpAtomsInGame = (
  gameRepository: GameRepository
): {
  gameStateQuery: RecoilValueReadOnly<Game | undefined>;
  currentGameIdState: RecoilState<GameId>;
  currentGameState: (gameId: GameId) => RecoilState<Game | undefined>;
} => {
  const currentGameIdState = atom<GameId>({
    key: AtomKeys.currentGameIdState,
    default: "" as GameId,
  });

  const currentGameState = atomFamily({
    key: AtomKeys.currentGameState,
    default: (gameId: GameId) => gameRepository.findBy(gameId),
  });

  const gameStateQuery = selector({
    key: SelectorKeys.inGameCurrentGame,
    get: ({ get }) => get(currentGameState(get(currentGameIdState))),
  });

  return {
    currentGameIdState,
    gameStateQuery,
    currentGameState,
  };
};
