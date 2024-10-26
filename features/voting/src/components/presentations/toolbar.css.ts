import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  gridTemplateRows: "repeat(1, minmax(0, 1fr))",
  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  gap: vars.spacing[2],
  alignItems: "center",
  height: vars.spacing[12],
  padding: `${vars.spacing[1]} ${vars.spacing[2]}`,
  borderRadius: "4px",
  backgroundColor: vars.color.orange[500],
});

export const role = style({
  display: "grid",
  gridTemplateRows: "repeat(1, minmax(0, 1fr))",
  gridTemplateColumns: "auto auto auto",
  borderRadius: "4px",
  backgroundColor: vars.color.orange[100],
  justifyContent: "center",
  placeItems: "center",
  gap: vars.spacing[2],
  padding: `${vars.spacing[1]} ${vars.spacing[2]}`,
});
