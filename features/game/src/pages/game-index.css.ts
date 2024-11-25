import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  width: "100%",
  height: "100%",
  placeContent: "center",
  position: "relative",
  gridTemplateRows: "auto 1fr 1fr",
  gridTemplateColumns: `${vars.spacing[64]} 1fr`,
});

export const list: string = style({
  gridRow: "2 / 4",
  gridColumn: "1",
});

export const header: string = style({
  gridRow: "1",
  gridColumn: "1",
});

export const detail: string = style({
  gridRow: "1 / 4",
  gridColumn: "2",
});
