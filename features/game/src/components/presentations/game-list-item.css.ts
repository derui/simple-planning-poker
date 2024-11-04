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
    height: vars.spacing[12],
    border: "1px solid transparent",
    backgroundColor: "transparent",
    borderRadius: "1rem",
    color: vars.color.purple[700],

    ":hover": {
      borderColor: vars.color.purple[500],
      backgroundColor: vars.color.purple[100],
      boxShadow: vars.shadow.xl,
    },

    selectors: {
      '&:not(:hover)&[aria-selected="true"]': {
        backgroundColor: vars.color.purple[100],
      },
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

export const selectMarkContainer: string = style({
  display: "flex",
  alignItems: "center",
  paddingRight: vars.spacing[4],
});

export const selectMark: string = style({
  display: "inline-block",
  alignItems: "center",
  visibility: "hidden",

  selectors: {
    '&[aria-selected="true"]': {
      visibility: "visible",
    },
  },
});
