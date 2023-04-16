import { Argument } from "classnames";

type Size = "s" | "m" | "l";
type Position = "before" | "after";

/**
 * return object to be able to display icon
 */
export const iconize = function iconize(icon: string, options?: { size?: Size; position?: Position }): Argument {
  const size = options?.size ?? "m";
  const position = options?.position ?? "before";

  return {
    [`${position}:inline-block`]: true,
    [`${position}:flex-none`]: true,
    [`${position}:[mask-image:url("/static/svg/tabler-icons/${icon}.svg")]`]: true,
    [`${position}:[mask-size:cover]`]: true,
    [`${position}:[mask-position:center]`]: true,
    [`${position}:[mask-repeat:no-repeat]`]: true,
    [`${position}:w-5`]: size === "s",
    [`${position}:h-5`]: size === "s",
    [`${position}:w-6`]: size === "m",
    [`${position}:h-6`]: size === "m",
    [`${position}:w-7`]: size === "l",
    [`${position}:h-7`]: size === "l",
  };
};
