import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { UserRole } from "../types.js";
import * as styles from "./toolbar.css.js";

export interface Props {
  /**
   * Event to notify change role between player and inspector.
   */
  onChangeRole?: (role: UserRole) => void;

  /**
   * Default role
   */
  defaultRole: UserRole;
}

export const Toolbar = function Toolbar({ onChangeRole, defaultRole }: Props): JSX.Element {
  const handleRoleChange = (role: UserRole) => {
    if (defaultRole !== role) {
      onChangeRole?.(role);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.role}>
        {defaultRole === "player" ? (
          <button onClick={() => handleRoleChange("player")}>
            <Icon.User variant={Variant.teal} />
            <span className={styles.roleName}>Player</span>
          </button>
        ) : (
          <button onClick={() => handleRoleChange("inspector")}>
            <Icon.Eye variant={Variant.orange} />
            <span className={styles.roleName}>Inspector</span>
          </button>
        )}
      </div>
    </div>
  );
};
