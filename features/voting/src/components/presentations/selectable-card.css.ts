import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

const rootBase = style({
  display: "grid",
  placeContent: "center",
  cursor: "pointer",
  height: "5rem",
  width: "3.5rem",
  borderRadius: "0.25rem",
  borderWidth: "2px",
  borderColor: "#ea580c",
  margin: "0.75rem",
  transitionProperty: "transform",
  ":first-of-type": {
    marginLeft: 0,
  },
  ":last-of-type": {
    marginRight: 0,
  },

  ":hover": {
    transform: `transpateY(-${vars.spacing[2]})`,
  },
});

export const notSelected = style([
  rootBase,
  {
    backgroundColor: vars.color.white,
  },
]);

export const selected = style([
  rootBase,
  {
    backgroundColor: vars.color.orange[200],
    transform: `translateY(-${vars.spacing[2]})`,
  },
]);
