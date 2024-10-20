import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small = styleVariants(colorVariants, styleVarianter(iconSmall, "loader-2"));
export const medium = styleVariants(colorVariants, styleVarianter(iconMedium, "loader-2"));
export const large = styleVariants(colorVariants, styleVarianter(iconLarge, "loader-2"));
export const extraLarge = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "loader-2"));
