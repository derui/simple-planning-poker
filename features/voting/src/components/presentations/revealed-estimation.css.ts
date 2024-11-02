import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  flexDirection: "column",
  margin: vars.spacing[3],
  alignItems: "center",
  gap: vars.spacing[2],
});

const cardBase = style([
  support.transition.all,
  {
    display: "grid",
    placeContent: "center",
    height: vars.spacing[20],
    width: vars.spacing[14],
    borderRadius: "4px",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${vars.color.orange[400]}`,
    color: vars.color.orange[700],
  },
]);

export const cardNotOpened: string = style([
  cardBase,
  {
    backgroundColor: vars.color.orange[200],
    transform: "rotateY(180deg)",
  },
]);

export const cardOpened: string = style([
  cardBase,
  {
    backgroundColor: vars.color.white,
    transform: "rotateY(0deg)",
  },
]);
