import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridRowStart: 1,
  gridRowEnd: 3,
  width: "100%",
  height: "100%",
  placeContent: "center",
  position: "relative",
});
