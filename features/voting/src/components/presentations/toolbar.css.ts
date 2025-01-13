import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  alignItems: "center",
  height: vars.spacing[12],
  borderRadius: "4px",
  border: `1px solid ${vars.color.teal[500]}`,
});

export const role: string = style([
  support.transition.all,
  {
    flex: "1 1 auto",
    display: "flex",
    alignItems: "center",
    height: "100%",
    gap: vars.spacing[2],
    padding: `0 ${vars.spacing[2]}`,
    cursor: "pointer",

    ":hover": {
      backgroundColor: vars.color.teal[100],
    },
  },
]);

export const roleName: string = style({
  color: vars.color.teal[800],
});
