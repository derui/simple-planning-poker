import { Header } from "../presentations/header.js";
import { hooks } from "../../hooks/facade.js";

/**
 * Header container component
 */
export const Header2 = function Header2() {
  const { theme, userRole } = hooks.usePollingPlace();
  const voting = hooks.useVoting();

  return (
    <Header
      theme={theme}
      onChangeTheme={voting.changeTheme}
      onChangeRole={voting.changeVoterRole}
      defaultRole={userRole}
    />
  );
};
