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

const PlayerButton = ({ onToggleRole }: { onToggleRole: () => void }) => (
  <button className={styles.role} onClick={() => onToggleRole()}>
    <Icon.User variant={Variant.teal} />
    <span className={styles.roleName}>Player</span>
  </button>
);

const InspectorButton = ({ onToggleRole }: { onToggleRole: () => void }) => (
  <button className={styles.role} onClick={() => onToggleRole()}>
    <Icon.Eye variant={Variant.orange} />
    <span className={styles.roleName}>Inspector</span>
  </button>
);

export const Toolbar = function Toolbar({ onToggleRole, defaultRole }: Props): JSX.Element {
  return (
    <div className={styles.root}>
      {defaultRole === "player" ? (
        <PlayerButton onToggleRole={onToggleRole || (() => {})} />
      ) : (
        <InspectorButton onToggleRole={onToggleRole || (() => {})} />
      )}
    </div>
  );
};
