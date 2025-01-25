import { VariantName } from "@spp/shared-color-variant";
import {
  disabledButtonVariants,
  disabledIconButtonVariants,
  enabledButtonVariants,
  enabledIconButtonVariants,
} from "./style.css.js";

export interface Props {
  /**
   * Base color of button. These colors are based on color system.
   */
  variant: VariantName;

  /**
   * Add style for disabled state.
   */
  disabled?: boolean;

  /**
   * Use full-rounded style instead of default button style
   */
  iconButton?: boolean;
}

/**
 * Get button style as class name for specified props.
 */
export const buttonStyle = function buttonStyle({ disabled = false, iconButton = false, variant }: Props): string {
  let style;

  if (disabled && iconButton) {
    style = disabledIconButtonVariants;
  } else if (disabled && !iconButton) {
    style = disabledButtonVariants;
  } else if (!disabled && iconButton) {
    style = enabledIconButtonVariants;
  } else {
    style = enabledButtonVariants;
  }

  return style[variant];
};
