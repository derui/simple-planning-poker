import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  padding: `${vars.spacing[1]} ${vars.spacing[4]}`,
  borderRadius: "9999px",
  border: `1px solid ${vars.color.teal[600]}`,
  height: vars.spacing[12],
});

export const contentContainer = style({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "row",
  alignItems: "center",
  gap: vars.spacing[4],
});

export const theme = style({
  flex: "1 1 auto",
  color: vars.color.teal[700],
  fontWeight: "bold",
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
});

export const themePlaceholder = style({
  flex: "1 1 auto",
  color: vars.color.gray[700],
  fontWeight: "bold",
  fontSize: vars.font.size.lg,
  lineHeight: vars.font.lineHeight.lg,
});

export const edit = style([
  support.transition.all,
  {
    border: `1px solid transparent`,
    ":hover": {
      borderColor: vars.color.orange[600],
      backgroundColor: vars.color.orange[100],
    },
    padding: vars.spacing[1],
    borderRadius: "9999px",
  },
]);

export const editorRoot = style({
  display: "flex",
  flexDirection: "row",
  flex: "0 0 auto",
  alignItems: "center",
  gap: vars.spacing[2],
});

export const editorInput = style([
  support.transition.all,
  {
    flex: "0 0 auto",
    width: "100%",
    padding: vars.spacing[2],
    outline: "none",
    borderRadius: "4px",
  },
]);

const buttonBase = style([
  support.transition.all,
  {
    flex: "0 0 auto",
    border: `1px solid transparent`,
    padding: vars.spacing[1],
    borderRadius: "9999px",
  },
]);

export const submitButton = style([
  buttonBase,
  {
    ":hover": {
      borderColor: vars.color.emerald[600],
      backgroundColor: vars.color.emerald[100],
    },
  },
]);

export const cancelButton = style([
  buttonBase,
  {
    ":hover": {
      borderColor: vars.color.gray[600],
      backgroundColor: vars.color.gray[100],
    },
  },
]);

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
