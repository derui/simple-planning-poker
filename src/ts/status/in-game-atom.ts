import { AtomKeys, SelectorKeys } from "./key";
import { atom, RecoilState, RecoilValueReadOnly, selector } from "recoil";
import { GamePlayerId, UserMode } from "@/domains/game-player";
import { UserId } from "@/domains/user";
import { GameId } from "@/domains/game";
import { Card } from "@/domains/card";

export interface UserHandViewModel {
  gamePlayerId: GamePlayerId;
  name: string;
  mode: UserMode;
  card?: Card;
  selected: boolean;
}

export interface GameViewModel {
  id: GameId;
  name: string;
  hands: UserHandViewModel[];
  cards: Card[];
  showedDown: boolean;
  average: number | undefined;
  invitationSignature: string;
}

export interface ShowDownResultViewModel {
  cardCounts: [number, number][];
  average: number;
}

export interface GamePlayerViewModel {
  id: GamePlayerId;
  userId: UserId;
  mode: UserMode;
  hand?: Card;
}

const currentGameState = atom<GameViewModel | undefined>({
  key: AtomKeys.currentGameState,
  default: undefined,
});

const gameStateQuery = selector({
  key: SelectorKeys.inGameCurrentGame,
  get: ({ get }) => get(currentGameState),
});

const currentGamePlayer = atom<GamePlayerViewModel | undefined>({
  key: AtomKeys.currentGamePlayerState,
  default: undefined,
});

const gamePlayerQuery = selector({
  key: SelectorKeys.inGameCurrentGamePlayer,
  get: ({ get }) => get(currentGamePlayer),
});

export const setUpAtomsInGame = (): {
  gameStateQuery: RecoilValueReadOnly<GameViewModel | undefined>;
  currentGameState: RecoilState<GameViewModel | undefined>;
  gamePlayerQuery: RecoilValueReadOnly<GamePlayerViewModel | undefined>;
  currentGamePlayer: RecoilState<GamePlayerViewModel | undefined>;
} => {
  return {
    gameStateQuery,
    currentGameState,
    currentGamePlayer,
    gamePlayerQuery,
  };
};
