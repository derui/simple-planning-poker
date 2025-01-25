import { Variant } from "@spp/shared-color-variant";
import { Prettify } from "@spp/shared-type-util";
import { IconProps } from "./props.js";
import { extraLarge, large, medium, small } from "./x.css.js";

export const X = function X({ size = "m", variant = Variant.gray }: Prettify<IconProps>): JSX.Element {
  let base: typeof small;

  switch (size) {
    case "s":
      base = small;
      break;
    case "m":
      base = medium;
      break;
    case "l":
      base = large;
      break;
    default:
      base = extraLarge;
      break;
  }

  const className = base[variant];

  return <span className={className}></span>;
};
