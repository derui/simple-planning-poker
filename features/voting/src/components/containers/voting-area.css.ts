import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const container = style({
  display: "grid",
  width: "100%",
  height: "100%",
  gridTemplateRows: "repeat(4, 1fr)",
  gridTemplateColumns: "repeat(1, 1fr)",
  gap: vars.spacing[4],
  placeItems: "center",
});
export const header = style({
  gridRowStart: 1,
  gridRowEnd: 2,
  width: "100%",
});
export const estimations = style({
  gridRowStart: 2,
  gridRowEnd: 3,
  width: "75%",
});
export const inspectors = style({
  gridRowStart: 3,
  gridRowEnd: 4,
  width: "75%",
});
export const cardHolder = style({
  gridRowStart: 4,
  gridRowEnd: 5,
  width: "75%",
});
