import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const main: string = style([
  support.transition.all,
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    listStyleType: "none",
    width: "100%",
    height: vars.spacing[16],
    border: `1px solid ${vars.color.purple[200]}`,
    backgroundColor: vars.color.purple[50],
    color: vars.color.purple[700],

    ":hover": {
      borderColor: vars.color.purple[600],
      boxShadow: vars.shadow.xl,
    },
  },
]);

export const link: string = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gridTemplateRows: "1fr",
  width: "100%",
  height: "100%",
  cursor: "pointer",
});

export const linkName: string = style({
  display: "flex",
  alignItems: "center",
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
  paddingLeft: vars.spacing[4],
});

export const ownerMarkContainer: string = style({
  display: "flex",
  alignItems: "center",
  paddingRight: vars.spacing[4],
});

export const ownerMark: string = style({
  display: "inline-block",
  backgroundColor: vars.color.purple[200],
  color: vars.color.purple[600],
  borderRadius: "9999px",
  alignItems: "center",
  paddingLeft: vars.spacing[3],
  paddingRight: vars.spacing[3],
  paddingTop: vars.spacing[1],
  paddingBottom: vars.spacing[1],
});

export const ownerMarkInvisible: string = style([
  ownerMark,
  {
    visibility: "hidden",
  },
]);
