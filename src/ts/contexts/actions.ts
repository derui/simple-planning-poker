import { createContext } from "react";
import { UserActions } from "@/status/user";
import { GameCreationAction } from "@/status/game-creator";
import { GameAction } from "@/status/game-action";
import { GameSelector } from "@/status/game-selector";

// context for GameCreationAction.
export const gameCreationActionContext = createContext<GameCreationAction>({} as GameCreationAction);

export const gameActionContext = createContext<GameAction>({} as GameAction);

export const gameSelectorContext = createContext<GameSelector>({} as GameSelector);

// context for UserActions.
export const userActionsContext = createContext<UserActions>({} as UserActions);
