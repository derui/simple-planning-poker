import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const input = style([
  support.transition.allAfter,
  {
    appearance: "none",
    position: "relative",
    margin: 0,
    width: vars.spacing[8],
    height: vars.spacing[8],
    borderWidth: "2px",
    borderColor: vars.color.emerald[500],
    borderStyle: "solid",
    borderRadius: "9999px",
    "::after": {
      content: "",
      display: "block",
      position: "absolute",
      borderRadius: "9999px",
      width: vars.spacing[5],
      height: vars.spacing[5],
      margin: "auto",
      top: vars.spacing[1],
      left: vars.spacing[1],
    },

    selectors: {
      "&:checked::after": {
        backgroundColor: vars.color.emerald[500],
      },
      "&:hover::after, &:hover::before": {
        backgroundColor: support.alpha(vars.color.emerald[500], 50),
      },
    },
  },
]);

export const label = style({
  display: "flex",
  gap: vars.spacing[1],
  alignItems: "center",
  color: vars.color.emerald[500],
});
