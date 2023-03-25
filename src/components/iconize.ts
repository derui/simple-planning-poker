import { Argument } from "classnames";

type Size = "s" | "m" | "l";

/**
 * return object to be able to display icon
 */
export const iconize = function iconize(icon: string, size: Size = "m"): Argument {
  return {
    "before:inline-block": true,
    "before:flex-none": true,
    [`before:[mask-image:url("/static/svg/tabler-icons/${icon}.svg")]`]: true,
    "before:[mask-size:cover]": true,
    "before:[mask-position:center]": true,
    "before:[mask-repeat:no-repeat]": true,
    "before:w-5": size === "s",
    "before:h-5": size === "s",
    "before:w-6": size === "m",
    "before:h-6": size === "m",
    "before:w-7": size === "l",
    "before:h-7": size === "l",
  };
};
