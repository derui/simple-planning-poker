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
  display: "flex",
  alignItems: "center",
  gap: vars.spacing[2],
  padding: `${vars.spacing[1]} ${vars.spacing[2]}`,
});

export const roleName: string = style({
  color: vars.color.teal[800],
});
