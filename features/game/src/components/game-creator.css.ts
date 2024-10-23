import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "flex",
  backgroundColor: vars.color.white,
  padding: vars.spacing[4],
  flexDirection: "row",
});

export const input = {
  container: style({
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "grid",
    gridTemplateRows: "repeat(3, auto)",
    padding: vars.spacing[3],
    gap: vars.spacing[2],
  }),

  label: style({
    color: vars.color.emerald[700],
  }),

  row: style({
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "repeat(3, auto)",
    marginBottom: vars.spacing[4],
    ":last-of-type": {
      marginBottom: 0,
    },
    gap: vars.spacing[2],
  }),

  input: style({
    width: "100%",
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
  placeItems: "center",
  gap: vars.spacing[1],
});

export const cancel = style([buttonStyle({ variant: Variant.gray })]);
export const cancelDisabled = style([buttonStyle({ variant: Variant.gray, disabled: true })]);

export const footer = {
  root: style({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "1fr",
    marginTop: vars.spacing[2],
    marginBottom: vars.spacing[2],
  }),
  submit: style([buttonStyle({ variant: Variant.emerald }), submitBase]),
};

export const submitLoading = style([buttonStyle({ variant: Variant.emerald, disabled: true }), submitBase]);
