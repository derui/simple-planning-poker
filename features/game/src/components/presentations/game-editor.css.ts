import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  width: "100%",
  height: "100%",
  display: "grid",
  gridTemplateRows: "repeat(3, auto)",
});

export const input: {
  label: string;
  row: string;
  input: string;
  error: string;
} = {
  label: style({
    color: vars.color.emerald[700],
  }),

  row: style({
    display: "flex",
    flexDirection: "column",
    padding: vars.spacing[3],
    gap: vars.spacing[2],
  }),

  input: style({
    padding: vars.spacing[2],
    outline: "none",
    borderRadius: "4px",
    border: `1px solid ${vars.color.emerald[800]}`,
    backgroundColor: vars.color.gray[100],
    ":focus": {
      borderColor: vars.color.emerald[600],
      backgroundColor: vars.color.white,
    },
  }),
  error: style({
    color: vars.color.cerise[700],
    backgroundColor: vars.color.cerise[200],
    paddingLeft: vars.spacing[3],
    paddingRight: vars.spacing[3],
    paddingTop: vars.spacing[1],
    paddingBottom: vars.spacing[1],
    borderRadius: "4px",
  }),
};

const submitBase = style({
  gridColumnStart: 3,
  gridColumnEnd: 4,
  display: "grid",
  gridTemplateColumns: "repeat(2, auto)",
  placeContent: "center",
  gap: vars.spacing[1],
});

export const cancel: string = style([buttonStyle({ variant: Variant.gray })]);
export const cancelDisabled: string = style([buttonStyle({ variant: Variant.gray, disabled: true })]);

export const footer: {
  root: string;
  submit: string;
} = {
  root: style({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "1fr",
    padding: vars.spacing[4],
  }),
  submit: style([buttonStyle({ variant: Variant.emerald }), submitBase]),
};

export const submitLoading: string = style([buttonStyle({ variant: Variant.emerald, disabled: true }), submitBase]);
