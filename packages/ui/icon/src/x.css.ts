import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "x"));
export const medium = styleVariants(colorVariants, styleVarianter(iconMedium, "x"));
export const large = styleVariants(colorVariants, styleVarianter(iconLarge, "x"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "x"));
