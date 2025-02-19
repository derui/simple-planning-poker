import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";
export const root: string = style({
  height: "100%",
  width: "100%",
  display: "grid",
  placeContent: "center",
});

export const overlayDialog: string = style({
  flex: "0 1 auto",
  flexDirection: "row",
  padding: vars.spacing[4],
  height: vars.spacing[16],
  border: "1px solid",
  borderColor: vars.color.teal[500],
  borderRadius: "4px",
  backgroundColor: vars.color.white,
  display: "flex",
  alignItems: "center",
});

export const dialogText: string = style({
  marginLeft: vars.spacing[3],
});

export const dialogContent: string = style({
  padding: vars.spacing[4],
});
