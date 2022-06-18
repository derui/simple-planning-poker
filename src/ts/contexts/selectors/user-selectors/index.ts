import { createContext, useContext } from "solid-js";
import { currentUserNameState } from "./current-user-name-state";
import { joinedGamesState } from "./joined-games-state";

interface Context {
  joinedGames: ReturnType<typeof joinedGamesState>;
  currentUserName: ReturnType<typeof currentUserNameState>;
}

export const UserSelectorsContext = createContext<Context>({} as any);

export const useUserSelectors = () => useContext(UserSelectorsContext);

/**
   initialize context via selectors
 */
export const initUserSelectorsContext = function (): Context {
  return {
    joinedGames: joinedGamesState(),
    currentUserName: currentUserNameState(),
  };
};
