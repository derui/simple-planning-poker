import { VariantName } from "@spp/shared-color-variant";

/**
 * Common properties for Icon
 */
export interface IconProps {
  /**
   * Size of icon. Default value is `m`
   */
  size?: "s" | "m" | "l" | "xl";

  /**
   * variant of icon color.
   */
  variant?: VariantName;
}
