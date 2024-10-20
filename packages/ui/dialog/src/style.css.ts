import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  gridTemplateRows: "auto 1fr",
  gridTemplateColumns: "1fr",
  width: vars.spacing[96],
  maxWidth: "28rem",
  margin: "auto",
  border: `1px solid ${vars.color.emerald[400]}`,
  borderRadius: "4px",
  boxShadow: vars.shadow.md,
  zIndex: 0,
  overflow: "hidden",
});

export const header = style({
  gridRowStart: 1,
  gridRowEnd: 2,
  display: "flex",
  flex: "1 1 auto",
  padding: vars.spacing[4],
  height: vars.spacing[16],
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  fontWeight: "bold",
  backgroundColor: vars.color.emerald[100],
  color: vars.color.emerald[800],
});

export const main = style({
  gridRowStart: 2,
  gridRowEnd: 4,
  width: "100%",
  height: "100%",
  overflow: "hidden",
});
