import { clsx } from "clsx";
import { Icons } from "./icons";

export { Icons };

interface IconProps {
  /**
   * Size of icon. Default value is `m`
   */
  size?: "s" | "m" | "l";

  /**
   * Type of icon.
   */
  type: Icons;
}

export const Icon = function Icon(props: IconProps) {
  const size = props.size ?? "m";

  const styles = {
    [`before:inline-block`]: true,
    [`before:flex-none`]: true,
    [`before:[mask-image:url("/static/svg/tabler-icons/${props.type}.svg")]`]: true,
    [`before:[mask-size:cover]`]: true,
    [`before:[mask-position:center]`]: true,
    [`before:[mask-repeat:no-repeat]`]: true,
    [`before:w-5`]: size == "s",
    [`before:h-5`]: size == "s",
    [`before:w-6`]: size == "m",
    [`before:h-6`]: size == "m",
    [`before:w-7`]: size == "l",
    [`before:h-7`]: size == "l",
    "w-5": size == "s",
    "h-5": size == "s",
    "w-6": size == "m",
    "h-6": size == "m",
    "w-7": size == "l",
    "h-7": size == "l",
    flex: true,
  };

  return <span className={clsx(styles)}></span>;
};
