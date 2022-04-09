import { createContext } from "react";
import { GameAction } from "@/status/game-action";
import { GameSelector } from "@/status/game-selector";

export const gameActionContext = createContext<GameAction>({} as GameAction);

export const gameSelectorContext = createContext<GameSelector>({} as GameSelector);
