import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "block",
  width: "80%",
  height: "100%",
  margin: "auto",
  padding: vars.spacing[4],
});
