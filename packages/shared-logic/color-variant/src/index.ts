/**
 * Types variant to be allowed in this application color schema.
 */
export enum Variant {
  gray = "gray",
  blue = "blue",
  teal = "teal",
  emerald = "emerald",
  orange = "orange",
  chestnut = "chestnut",
  cerise = "cerise",
  purple = "purple",
  indigo = "indigo",
}

/**
 * Type of name set of variant.
 */
export type VariantName = keyof typeof Variant;
