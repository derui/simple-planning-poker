import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  gap: vars.spacing[2],
  alignItems: "center",
  height: vars.spacing[12],
  borderRadius: "4px",
  border: `1px solid ${vars.color.orange[500]}`,
});

export const role: string = style({
  flex: '1 1 auto',
  display: "grid",
  gridTemplateRows: "repeat(1, minmax(0, 1fr))",
  gridTemplateColumns: "auto auto auto",
  justifyContent: "center",
  placeItems: "center",
  gap: vars.spacing[2],
  padding: `${vars.spacing[1]} ${vars.spacing[2]}`,
});
