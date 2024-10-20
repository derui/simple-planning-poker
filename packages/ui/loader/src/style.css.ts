import { animation, vars } from "@spp/ui-theme";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style({
  position: "relative",
  display: "inline-block",
});

export const hidden = style({ display: "none" });

const sizes = {
  s: vars.spacing[5],
  m: vars.spacing[6],
  l: vars.spacing[7],
};

export const loader = styleVariants(sizes, (size) => [
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

export const spinLoader = styleVariants(sizes, (size) => [
  spinLoaderBase,
  animation.spin,
  {
    width: size,
    height: size,
  },
]);
