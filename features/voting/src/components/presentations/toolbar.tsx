import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import { ToggleButton } from "@spp/ui-toggle-button";
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
          <>
            <Icon.User variant={Variant.teal} onClick={() => handleRoleChange("player")} />
            <span className={styles.roleName}>Player</span>
          </>
        ) : (
          <>
            <Icon.Eye variant={Variant.orange} onClick={() => handleRoleChange("inspector")} />
            <span className={styles.roleName}>Inspector</span>
          </>
        )}
        <ToggleButton initialChecked={defaultRole === "inspector"} onToggle={(checked) => handleRoleChange(checked ? "inspector" : "player")} />
      </div>
    </div>
  );
};
