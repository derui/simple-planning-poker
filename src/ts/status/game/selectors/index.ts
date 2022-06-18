import { currentGameInformationState } from "./current-game-information-state";
import { currentGameName } from "./current-game-name";
import { currentGameState } from "./current-game-state";
import { currentPlayerInformationState } from "./current-player-information-state";
import { currentPlayerSelectedCardState } from "./current-player-selected-card-state";
import { gameCreatingState } from "./game-creating-state";
import { selectableCardsState } from "./selectable-cards-state";
import { showDownResultState } from "./show-down-result-state";
import { userHandsState } from "./user-hands-state";

export const useCurrentGameState = () => currentGameState();
export const useCurrentGameName = () => currentGameName();
export const useCurrentGameInformationState = () => currentGameInformationState();
export const useCurrentPlayerInformationState = () => currentPlayerInformationState();
export const useGameCreatingState = () => gameCreatingState();
export const useSelectableCardsState = () => selectableCardsState();
export const useShowDownResultState = () => showDownResultState();
export const useUserHandsState = () => userHandsState();
export const useCurrentPlayerSelectedCardState = () => currentPlayerSelectedCardState();
