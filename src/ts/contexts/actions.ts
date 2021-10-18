import { SigninActions } from "../status/signin";
import { createContext } from "react";
import { InGameAction } from "~/src/ts/status/in-game-action";
import { UserActions } from "~/src/ts/status/user";
import { InGameSelector } from "~/src/ts/status/in-game-selector";
import { GameCreationAction } from "~/src/ts/status/game-creator";

// context for SignInAction.
export const signInActionContext = createContext<SigninActions>({} as SigninActions);

// context for GameCreationAction.
export const gameCreationActionContext = createContext<GameCreationAction>({} as GameCreationAction);

export const inGameActionContext = createContext<InGameAction>({} as InGameAction);

export const inGameSelectorContext = createContext<InGameSelector>({} as InGameSelector);

// context for UserActions.
export const userActionsContext = createContext<UserActions>({} as UserActions);
