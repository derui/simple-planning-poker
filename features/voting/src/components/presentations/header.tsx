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
 * Layout component for container.
 */
export const Header = function Header({ theme, onChangeTheme, defaultRole, onToggleRole }: Props): JSX.Element {
   
  return (
    <div className={styles.root}>
      <ThemeEditor theme={theme} onSubmit={onChangeTheme} />
      <div className={styles.buttonContainer}>
        <button 
          onClick={copyVotingUrl}
          className={styles.copyButton}
        >
      </div>
      <Toolbar defaultRole={defaultRole} onToggleRole={onToggleRole} />
    </div>
  );
};
