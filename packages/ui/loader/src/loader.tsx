import { clsx } from "clsx";
import { Icon, Icons } from "@spp/ui-icon";

type Size = "s" | "m" | "l";

interface Props {
  shown: boolean;
  size: Size;
}

const sizeStyle = (size: Size) =>
  clsx(
    {
      "w-5": size === "s",
      "h-5": size === "s",
    },
    {
      "w-6": size === "m",
      "h-6": size === "m",
    },
    {
      "w-7": size === "l",
      "h-7": size === "l",
    }
  );

const styles = {
  root: (size: Size, shown: boolean) =>
    clsx(
      "relative",
      {
        "inline-block": shown,
        hidden: !shown,
      },
      sizeStyle(size)
    ),
  spinLoader: (size: Size) =>
    clsx("absolute", "top-0", "left-0", "inline-block", "z-10", "animate-spin", sizeStyle(size)),
};

// eslint-disable-next-line func-style
export function Loader({ size, shown }: Props) {
  return (
    <span className={styles.root(size, shown)} data-shown={shown} role="alert">
      <span className={styles.spinLoader(size)}>
        <Icon type={Icons.loader2} size={size} />
      </span>
    </span>
  );
}
