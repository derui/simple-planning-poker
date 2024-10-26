import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: vars.spacing[36],
  backgroundColor: vars.color.emerald[50],
  width: "100%",
});

export const inspector = style({
  fontWeight: "bold",
  color: vars.color.emerald[700],
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
});
