import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "1fr",
  gridRowStart: 1,
  gridRowEnd: 3,
  placeContent: "center",
  position: "relative",
  minHeight: "100%",
});
