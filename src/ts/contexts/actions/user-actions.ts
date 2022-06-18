import { createUseChangeUserName } from "@/status/user/actions/use-change-user-name";
import { createContext } from "solid-js";

export interface UserActions {
  useChangeUserName: ReturnType<typeof createUseChangeUserName>;
}

// context for UserActions.
export const userActionsContext = createContext<UserActions>({} as UserActions);
