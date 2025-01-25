import { Variant } from "@spp/shared-color-variant";
import { styleVariants } from "@vanilla-extract/css";
import { colorVariants, iconExtraLarge, iconLarge, iconMedium, iconSmall, styleVarianter } from "./style.css.js";

export const small: Record<Variant, string> = styleVariants(colorVariants, styleVarianter(iconSmall, "eye"));
export const medium: Record<Variant, string> = styleVariants(colorVariants, styleVarianter(iconMedium, "eye"));
export const large: Record<Variant, string> = styleVariants(colorVariants, styleVarianter(iconLarge, "eye"));
export const extraLarge: Record<Variant, string> = styleVariants(colorVariants, styleVarianter(iconExtraLarge, "eye"));
