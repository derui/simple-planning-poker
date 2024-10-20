import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "pencil"));
export const medium = styleVariants(colorVariants, styleVarianter(iconMedium, "pencil"));
export const large = styleVariants(colorVariants, styleVarianter(iconLarge, "pencil"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "pencil"));
