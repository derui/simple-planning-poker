import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "1fr",
  gridRowStart: 2,
  gridRowEnd: 3,
});
