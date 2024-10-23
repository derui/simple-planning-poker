import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  height: "100%",
  width: "100%",
  display: "grid",
  placeContent: "center",
});

export const overlayDialog = style({
  display: "flex",
  flexDirection: "row",
  padding: "1rem",
  height: "4rem",
  border: `1 solid ${vars.color.teal[500]}`,
  borderRadius: "4px",
  backgroundColor: vars.color.white,
  alignItems: "center",
});

export const dialogText = style({
  marginLeft: vars.spacing[3],
});

export const dialogContent = style({
  padding: vars.spacing[4],
});
