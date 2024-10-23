import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  width: "100%",
  height: "100%",
  placeContent: "center",
  position: "relative",
});

export const container = style({
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  gridTemplateColumns: "1fr",
  width: vars.spacing[96],
  borderRadius: "4px",
  border: `1px solid ${vars.color.purple[600]}`,
  overflow: "hidden",
});

export const header = style({
  padding: vars.spacing[4],
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  fontWeight: "bold",
  backgroundColor: vars.color.purple[200],
  color: vars.color.purple[700],
});

export const mainRoot = style({});

export const mainList = style({ padding: `0 ${vars.spacing[2]}`, maxHeight: vars.spacing[96], overflowY: "auto" });

export const footer = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "end",
  padding: vars.spacing[4],
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  fontWeight: "bold",
  borderTop: `1px solid ${vars.color.purple[600]}`,
  color: vars.color.purple[700],
});

export const creator = style([buttonStyle({ variant: Variant.emerald })]);
export const empty = style({
  flex: "auto",
  textAlign: "center",
  position: "relative",
  padding: `${vars.spacing[10]} ${vars.spacing[3]}`,
});
export const emptyText = style({
  position: "relative",
  verticalAlign: "middle",
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  fontWeight: "bold",
});
export const loadingRoot = style({
  display: "grid",
  width: "100%",
  height: "100%",
  placeContent: "center",
  backgroundColor: vars.color.gray[100],
});
export const loadingContainer = style({
  display: "grid",
  gridTemplateRows: "1fr 1fr",
  gridTemplateColumns: "1fr",
  placeItems: "center",
  gap: vars.spacing[4],
  borderRadius: "4px",
  backgroundColor: vars.color.white,
  width: vars.spacing[64],
  height: vars.spacing[36],
  padding: vars.spacing[8],
});
export const loadingText = style({
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  color: vars.color.emerald[700],
});
