import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  flexDirection: "row",
  gap: vars.spacing[2],
  backgroundColor: vars.color.indigo[100],
  justifyContent: "center",
});

export const emptyText: string = style({
  color: vars.color.indigo[500],
  fontWeight: "bold",
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  margin: vars.spacing[7],
});
