import createUseChangeUserName from "@/status/user/actions/use-change-user-name";
import { createContext } from "react";

export interface UserActions {
  useChangeUserName: ReturnType<typeof createUseChangeUserName>;
}

// context for UserActions.
const userActionsContext = createContext<UserActions>({} as UserActions);
export default userActionsContext;
