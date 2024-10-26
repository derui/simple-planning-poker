import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flex: "0 0 none",
  outline: "none",
  border: "none",
  padding: "0",
  height: vars.spacing[8],
  alignItems: "center",
  borderRadius: "4px",
});

export const input = style({
  display: "none",
});

export const toggleRoot = style({
  display: "flex",
  position: "relative",
  backgroundColor: "transparent",
  height: vars.spacing[6],
  justifyContent: "center",
  border: `1px solid ${vars.color.emerald[600]}`,
  borderRadius: "4px",
  overflow: "hidden",
});

const switchRail = style([
  support.transition.all,
  {
    position: "relative",
    display: "inline-block",
    margin: "0",
    padding: `0`,
    width: vars.spacing[12],
    height: "100%",
  },
]);

export const switchRailChecked = style([
  switchRail,
  {
    backgroundColor: vars.color.emerald[300],
  },
]);

export const switchRailUnchecked = style([
  switchRail,
  {
    backgroundColor: vars.color.emerald[100],
  },
]);

export const switchBox = style([
  support.transition.all,
  {
    position: "absolute",
    display: "inline-block",
    backgroundColor: vars.color.emerald[500],
    height: "100%",
    width: vars.spacing[6],
    left: "0",
    top: "0",
  },
]);

export const switchBoxChecked = style([
  switchBox,
  {
    transform: `translateX(${vars.spacing[6]})`,
  },
]);
