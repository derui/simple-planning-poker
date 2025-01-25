import { Icon } from "@spp/ui-icon";
import { UserRole } from "../types.js";
import * as styles from "./header.css.js";
import { ThemeEditor } from "./theme-editor.js";
import { Toolbar } from "./toolbar.js";

export interface Props {
  /**
   * Theme of voting
   */
  theme: string;

  /**
   * Handler to change theme
   */
  onChangeTheme?: (theme: string) => void;

  /**
   * Handler to change user role
   */
  onToggleRole?: () => void;

  /**
   * Default user role to display
   */
  defaultRole: UserRole;
}

/**
 * Copy current location to the clipboard
 */
function copyVotingUrl() {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert("Voting URL copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy voting URL:", err);
    });
}

/**
 * Layout component for container.
 */
export const Header = function Header({ theme, onChangeTheme, defaultRole, onToggleRole }: Props): JSX.Element {
  return (
    <div className={styles.root}>
      <ThemeEditor theme={theme} onSubmit={onChangeTheme} />
      <div className={styles.buttonContainer}>
        <button onClick={copyVotingUrl} className={styles.copyButton}>
          <Icon.Copy />
          Copy Voting URL
        </button>
      </div>
      <Toolbar defaultRole={defaultRole} onToggleRole={onToggleRole} />
    </div>
  );
};
