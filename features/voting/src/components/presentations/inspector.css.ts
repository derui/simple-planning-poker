import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  flexDirection: "column",
  padding: vars.spacing[3],
  alignItems: "center",
});

export const name: string = style({
  flex: "1 1 auto",
  color: vars.color.indigo[700],
  marginBottom: vars.spacing[2],
});
