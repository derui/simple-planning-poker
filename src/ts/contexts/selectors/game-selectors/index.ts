import { createContext, useContext } from "solid-js";
import { currentGameInformationState } from "./current-game-information-state";
import { currentGameName } from "./current-game-name";
import { currentGameState } from "./current-game-state";
import { currentPlayerInformationState } from "./current-player-information-state";
import { currentPlayerSelectedCardState } from "./current-player-selected-card-state";
import { gameCreatingState } from "./game-creating-state";
import { selectableCardsState } from "./selectable-cards-state";
import { showDownResultState } from "./show-down-result-state";
import { userHandsState } from "./user-hands-state";

interface Context {
  currentGame: ReturnType<typeof currentGameState>;
  currentGameName: ReturnType<typeof currentGameName>;
  currentGameInformation: ReturnType<typeof currentGameInformationState>;
  currentPlayerInformation: ReturnType<typeof currentPlayerInformationState>;
  gameCreating: ReturnType<typeof gameCreatingState>;
  selectableCards: ReturnType<typeof selectableCardsState>;
  showDownResult: ReturnType<typeof showDownResultState>;
  userHands: ReturnType<typeof userHandsState>;
  currentPlayerSelectedCard: ReturnType<typeof currentPlayerSelectedCardState>;
}

export const GameSelectorsContext = createContext<Context>({} as any);

export const useGameSelectors = () => useContext(GameSelectorsContext);

/**
   initialize context via selectors
*/
export const initGameSelectorsContext = function (): Context {
  return {
    currentGame: currentGameState(),
    currentGameName: currentGameName(),
    currentGameInformation: currentGameInformationState(),
    currentPlayerInformation: currentPlayerInformationState(),
    gameCreating: gameCreatingState(),
    selectableCards: selectableCardsState(),
    showDownResult: showDownResultState(),
    userHands: userHandsState(),
    currentPlayerSelectedCard: currentPlayerSelectedCardState(),
  };
};
