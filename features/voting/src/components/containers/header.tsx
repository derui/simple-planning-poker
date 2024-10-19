import { HeaderLayout } from "./header.layout.js";
import { hooks } from "../../hooks/facade.js";

/**
 * Header container component
 */
export const Header = function Header() {
  const { theme, userRole } = hooks.usePollingPlace();
  const voting = hooks.useVoting();

  return (
    <HeaderLayout
      theme={theme}
      onChangeTheme={voting.changeTheme}
      onChangeRole={voting.changeVoterRole}
      defaultRole={userRole}
    />
  );
};
