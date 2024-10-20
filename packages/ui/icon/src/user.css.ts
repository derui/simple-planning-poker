import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "user"));
export const medium = styleVariants(colorVariants, styleVarianter(iconMedium, "user"));
export const large = styleVariants(colorVariants, styleVarianter(iconLarge, "user"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "user"));
