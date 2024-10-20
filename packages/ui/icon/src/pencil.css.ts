import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "pencil"));
export const medium = styleVariants(colorVariants, styleVarianter(iconSmall, "pencil"));
export const large = styleVariants(colorVariants, styleVarianter(iconSmall, "pencil"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconSmall, "pencil"));
