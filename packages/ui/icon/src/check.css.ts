import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "check"));
export const medium = styleVariants(colorVariants, styleVarianter(iconMedium, "check"));
export const large = styleVariants(colorVariants, styleVarianter(iconLarge, "check"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "check"));
