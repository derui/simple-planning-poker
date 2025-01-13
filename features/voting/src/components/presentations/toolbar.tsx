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
  const handleToggle = (checked: boolean) => {
    if (checked) {
      onChangeRole?.("inspector");
    } else {
      onChangeRole?.("player");
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.role}>
        <Icon.User variant={Variant.orange} />
        <span className={styles.roleName}>{defaultRole}</span>
        <ToggleButton initialChecked={defaultRole === "inspector"} onToggle={handleToggle} />
        <Icon.Eye variant={Variant.orange} />
      </div>
    </div>
  );
};
