import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

const rootBase = style([
  support.transition.all,
  {
    display: "grid",
    placeContent: "center",
    cursor: "pointer",
    height: vars.spacing[20],
    width: vars.spacing[14],
    borderRadius: "4px",
    border: `1px solid ${vars.color.orange[400]}`,
    color: vars.color.orange[700],
    margin: vars.spacing[3],
    ":first-of-type": {
      marginLeft: 0,
    },
    ":last-of-type": {
      marginRight: 0,
    },

    ":hover": {
      transform: `transpateY(-${vars.spacing[2]})`,
    },
  },
]);

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
