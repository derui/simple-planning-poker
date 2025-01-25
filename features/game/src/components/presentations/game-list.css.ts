import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing[3],
  backgroundColor: vars.color.white,
  listStyle: "none",
  padding: `${vars.spacing[2]} ${vars.spacing[3]}`,
  margin: 0,
});

export const plusContainer: string = style([
  support.transition.all,
  {
    flex: "0 0 auto",
    flexDirection: "row",
    height: vars.spacing[12],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: vars.color.indigo[700],
    userSelect: "none",

    ":hover": {
      backgroundColor: vars.color.indigo[100],
    },
  },
]);
