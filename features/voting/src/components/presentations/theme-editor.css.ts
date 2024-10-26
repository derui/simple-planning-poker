import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  padding: `${vars.spacing[1]} ${vars.spacing[4]}`,
  borderRadius: "9999px",
  border: `1px solid ${vars.color.teal[600]}`,
  height: vars.spacing[12],
  alignItems: "center",
});

export const contentContainer = style({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "row",
  alignItems: "center",
  gap: vars.spacing[4],
});

export const edit = style([
  buttonStyle({ variant: Variant.orange, iconButton: true }),
  {
    flex: "0 0 auto",
    marginLeft: vars.spacing[4],
  },
]);

export const editorRoot = style({
  display: "flex",
  flexDirection: "row",
  flex: "1 1 auto",
  alignItems: "center",
  gap: vars.spacing[2],
});

export const editorInput = style([
  support.transition.all,
  {
    flex: "1 1 auto",
    padding: vars.spacing[2],
    outline: "none",
    borderRadius: "4px",
    border: `1px solid ${vars.color.emerald[800]}`,
    backgroundColor: vars.color.gray[100],

    ":focus": {
      borderColor: vars.color.emerald[600],
      backgroundColor: vars.color.white,
    },
  },
]);

export const submitButton = style([buttonStyle({ variant: Variant.emerald, iconButton: true })]);

export const cancelButton = style([buttonStyle({ variant: Variant.gray, iconButton: true })]);

export const submitButtonHidden = style([
  submitButton,
  {
    display: "none",
  },
]);

export const cancelButtonHidden = style([
  cancelButton,
  {
    display: "none",
  },
]);
