import { support, vars } from "@spp/ui-theme";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style({
  position: "relative",
  display: "inline-block",
});

export const hidden: string = style({ display: "none" });

const sizes = {
  s: vars.spacing[5],
  m: vars.spacing[6],
  l: vars.spacing[7],
};

export const loader: Record<"s" | "m" | "l", string> = styleVariants(sizes, (size) => [
  base,
  {
    width: size,
    height: size,
  },
]);

const spinLoaderBase = style({
  position: "absolute",
  top: 0,
  left: 0,
  display: "inline-block",
  zIndex: vars.zIndex[10],
});

export const spinLoader: Record<"s" | "m" | "l", string> = styleVariants(sizes, (size) => [
  spinLoaderBase,
  support.animation.spin,
  {
    width: size,
    height: size,
  },
]);
