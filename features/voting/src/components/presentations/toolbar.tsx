import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { UserRole } from "../types.js";
import * as styles from "./toolbar.css.js";

export interface Props {
  /**
   * Event to notify change role between player and inspector.
   */
  onToggleRole?: () => void;

  /**
   * Default role
   */
  defaultRole: UserRole;
}

export const Toolbar = function Toolbar({ onToggleRole, defaultRole }: Props): JSX.Element {
  const handleRoleClick = () => {
    onToggleRole?.();
  };

  return (
    <div className={styles.root}>
        {defaultRole === "player" ? (
          <button className={styles.role} onClick={() => handleRoleClick()}>
            <Icon.User variant={Variant.teal} />
            <span className={styles.roleName}>Player</span>
          </button>
        ) : (
          <button className={styles.role} onClick={() => handleRoleClick()}>
            <Icon.Eye variant={Variant.orange} />
            <span className={styles.roleName}>Inspector</span>
          </button>
        )}
    </div>
  );
};
