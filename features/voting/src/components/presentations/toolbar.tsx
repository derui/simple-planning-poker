import { Variant } from "@spp/shared-color-variant";
import { Icon, Icons } from "@spp/ui-icon";
import { ToggleButton } from "@spp/ui-toggle-button";
import { clsx } from "clsx";

export interface Props {
  /**
   * Event to notify change role between player and inspector.
   */
  onChangeRole?: (role: "player" | "inspector") => void;

  /**
   * Default role
   */
  defaultRole: "player" | "inspector";
}

const styles = {
  root: clsx("grid", "grid-rows-1", "grid-cols-1", "place-content-center", "gap-2", "place-items-center"),
  role: clsx(
    "grid",
    "grid-rows-1",
    "grid-cols-[auto_auto_auto]",
    "rounded",
    "bg-orange-100",
    "place-content-center",
    "gap-2",
    "place-items-center",
    "px-2",
    "py-1"
  ),
} as const;

export const Toolbar = function Toolbar({ onChangeRole, defaultRole }: Props) {
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
        <Icon type={Icons.user} variant={Variant.orange} />
        <ToggleButton initialChecked={defaultRole == "inspector"} onToggle={handleToggle} />
        <Icon type={Icons.eye} variant={Variant.orange} />
      </div>
    </div>
  );
};
