import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const input: string = style({
  flex: "1 1 auto",
  display: "block",
  height: vars.spacing[8],
  padding: `${vars.spacing[2]} ${vars.spacing[3]}`,
  border: `1px solid ${vars.color.gray[300]}`,
  borderRadius: "0.5rem",
  outline: "none",
  backgroundColor: vars.color.gray[200],
  appearance: "none",

  ":focus": {
    outline: `1px solid ${vars.color.teal[500]}`,
    boxShadow: vars.shadow.md,
    backgroundColor: "transparent",
  },
});
