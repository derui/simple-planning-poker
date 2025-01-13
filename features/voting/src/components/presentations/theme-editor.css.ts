import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  padding: `${vars.spacing[1]} ${vars.spacing[4]}`,
  borderRadius: vars.spacing[2],
  border: `1px solid ${vars.color.teal[600]}`,
  height: vars.spacing[12],
  alignItems: "center",
});

export const contentContainer: string = style({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "row",
  alignItems: "center",
  gap: vars.spacing[4],
});

export const edit: string = style([
  buttonStyle({ variant: Variant.orange, iconButton: true }),
  {
    flex: "0 0 auto",
    marginLeft: vars.spacing[4],
  },
]);

export const editorRoot: string = style({
  display: "flex",
  flexDirection: "row",
  flex: "1 1 auto",
  alignItems: "center",
  gap: vars.spacing[2],
});

export const editorInput: string = style([
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

export const submitButton: string = style([buttonStyle({ variant: Variant.emerald, iconButton: true })]);

export const cancelButton: string = style([buttonStyle({ variant: Variant.gray, iconButton: true })]);

export const submitButtonHidden: string = style([
  submitButton,
  {
    display: "none",
  },
]);

export const cancelButtonHidden: string = style([
  cancelButton,
  {
    display: "none",
  },
]);

export const header: string = style({
  padding: `0px ${vars.spacing[2]}`,
  marginRight: vars.spacing[3],
  borderRight: `1px solid ${vars.color.teal[600]}`,
  color: vars.color.teal[600],
});
