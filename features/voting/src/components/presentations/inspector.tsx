import { Icon, Icons } from "@spp/ui-icon";
import { clsx } from "clsx";

export interface Props {
  name: string;
}

const styles = {
  root: clsx("flex", "flex-col", "p-3", "items-center"),
  name: clsx("flex-auto", "text-indigo-700", "font-bold", "mb-2"),
} as const;

export const Inspector = function Inspector({ name }: Props) {
  return (
    <span className={styles.root}>
      <span className={styles.name}>{name}</span>
      <Icon type={Icons.user} size="xl" variant="indigo" />
    </span>
  );
};
