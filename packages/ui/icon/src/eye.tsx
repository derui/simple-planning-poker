import { Variant } from "@spp/shared-color-variant";
import { Prettify } from "@spp/shared-type-util";
import { extraLarge, large, medium, small } from "./eye.css.js";
import { IconProps } from "./props.js";

export const Eye = function Eye({ size = "m", variant = Variant.gray }: Prettify<IconProps>): JSX.Element {
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
