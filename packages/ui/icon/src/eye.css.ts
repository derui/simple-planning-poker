import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "eye"));
export const medium = styleVariants(colorVariants, styleVarianter(iconMedium, "eye"));
export const large = styleVariants(colorVariants, styleVarianter(iconLarge, "eye"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "eye"));
