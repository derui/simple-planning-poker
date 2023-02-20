import createUseChangeUserMode from "@/status/game/actions/use-change-user-mode";
import createUseCreateGame from "@/status/game/actions/use-create-game";
import createUseJoinUser from "@/status/game/actions/use-join-user";
import createUseLeaveGame from "@/status/game/actions/use-leave-game";
import createUseNewGame from "@/status/game/actions/use-new-game";
import createUseOpenGame from "@/status/game/actions/use-open-game";
import createUseSelectCard from "@/status/game/actions/use-select-card";
import createUseSelectGame from "@/status/game/actions/use-select-game";
import createUseShowDown from "@/status/game/actions/use-show-down";
import { createContext } from "react";

export interface GameActions {
  useCreateGame: ReturnType<typeof createUseCreateGame>;
  useSelectCard: ReturnType<typeof createUseSelectCard>;
  useNewGame: ReturnType<typeof createUseNewGame>;
  useJoinUser: ReturnType<typeof createUseJoinUser>;
  useShowDown: ReturnType<typeof createUseShowDown>;
  useChangeUserMode: ReturnType<typeof createUseChangeUserMode>;
  useSelectGame: ReturnType<typeof createUseSelectGame>;
  useOpenGame: ReturnType<typeof createUseOpenGame>;
  useLeaveGame: ReturnType<typeof createUseLeaveGame>;
}

// context for GameCreationAction.
const gameActionsContext = createContext<GameActions>({} as GameActions);

export default gameActionsContext;
