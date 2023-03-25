import { Argument } from "classnames";

/**
 * return object to be able to display icon
 */
export const iconize = function iconize(icon: string): Argument {
  return {
    "before:inline-block": true,
    "before:flex-none": true,
    [`before:[mask-image:url("/static/svg/tabler-icons/${icon}.svg")]`]: true,
    "before:[mask-size:cover]": true,
    "before:[mask-position:center]": true,
    "before:[mask-repeat:no-repeat]": true,
  };
};
