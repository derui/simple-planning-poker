import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  width: "100%",
  height: "100%",
  position: "relative",
  minHeight: vars.spacing[12],
  overflow: "hidden",
});
