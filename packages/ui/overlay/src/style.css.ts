import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style([
  support.transition.all,
  {
    position: "absolute",
    zIndex: vars.zIndex[10],
    backgroundColor: support.alpha(vars.color.gray[500], 80),
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
]);

export const hidden: string = style([
  root,
  {
    visibility: "hidden",
    zIndex: `-${vars.zIndex[40]}`,
    opacity: 0,
  },
]);
