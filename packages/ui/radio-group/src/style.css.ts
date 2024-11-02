import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  columnGap: vars.spacing[3],
  margin: vars.spacing[2],
});
