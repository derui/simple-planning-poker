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

const PlayerRole = ({ onToggleRole }: { onToggleRole?: () => void }) => (
  <div className={styles.role} onClick={() => onToggleRole?.()}>
    <Icon.User variant={Variant.teal} />
    <span className={styles.roleName}>Player</span>
  </div>
);

const InspectorRole = ({ onToggleRole }: { onToggleRole?: () => void }) => (
  <div className={styles.role} onClick={() => onToggleRole?.()}>
    <Icon.Eye variant={Variant.teal} />
    <span className={styles.roleName}>Inspector</span>
  </div>
);

export const Toolbar = function Toolbar({ onToggleRole, defaultRole }: Props): JSX.Element {
  return (
    <div className={styles.root}>
      {defaultRole === "player" ? (
        <PlayerRole onToggleRole={onToggleRole} />
      ) : (
        <InspectorRole onToggleRole={onToggleRole} />
      )}
    </div>
  );
};
