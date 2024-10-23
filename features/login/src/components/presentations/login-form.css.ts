import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  height: "100%",
  width: "100%",
  display: "grid",
  gridTemplateRows: "repeat(3, 1fr)",
  gridTemplateColumns: "1fr",
  gap: vars.spacing[4],
});

export const dialogText = style({
  marginLeft: vars.spacing[3],
});

export const inputContainer = style({
  display: "grid",
  gridTemplateRows: "repeat(2, 1fr)",
  gridTemplateColumns: "1fr",
  margin: 0,
  marginTop: "auto",
  marginBottom: "auto",
});

export const inputLabel = style({
  display: "grid",
  placeContent: "start",
  width: vars.spacing[24],
});

export const input = style([
  support.transition.all,
  {
    padding: vars.spacing[2],
    outline: "none",
    borderRadius: "4px",
    border: `1px solid ${vars.color.emerald[800]}`,
    backgroundColor: vars.color.gray[100],
    ":focus": {
      border: `1px solid ${vars.color.emerald[600]}`,
      backgroundColor: vars.color.white,
    },
  },
]);

export const submitContainer = style({
  display: "grid",
  placeContent: "center",
});

export const submit = buttonStyle({ variant: Variant.emerald });
