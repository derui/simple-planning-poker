import { clsx } from "clsx";
import { ThemeEditor } from "./theme-editor.js";
import { Toolbar } from "./toolbar.js";
import { UserRole } from "../types.js";

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
  onChangeRole?: (role: UserRole) => void;

  /**
   * Default user role to display
   */
  defaultRole: UserRole;
}

const styles = {
  root: clsx("grid", "grid-rows-1", "grid-cols-[auto_1fr_auto]"),
} as const;

export const Header = function Header({ theme, onChangeTheme, defaultRole, onChangeRole }: Props) {
  return (
    <div className={styles.root}>
      <ThemeEditor theme={theme} onSubmit={onChangeTheme} />
      <div></div>
      <Toolbar defaultRole={defaultRole} onChangeRole={onChangeRole} />
    </div>
  );
};
