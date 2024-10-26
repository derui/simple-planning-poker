import { Variant } from "@spp/shared-color-variant";
import { Icon } from "@spp/ui-icon";
import * as styles from "./inspector.css.js";

export interface Props {
  name: string;
}

export const Inspector = function Inspector({ name }: Props) {
  return (
    <span className={styles.root}>
      <span className={styles.name}>{name}</span>
      <Icon.User size="xl" variant={Variant.indigo} />
    </span>
  );
};
