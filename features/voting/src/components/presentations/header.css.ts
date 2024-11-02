import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "repeat(1, 1fr)",
  gridTemplateColumns: "auto 1fr auto",
});
