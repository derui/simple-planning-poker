import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style([
  support.animation.pulse,
  {
    width: "100%",
    height: "100%",
    backgroundColor: vars.color.gray[100],
  },
]);
