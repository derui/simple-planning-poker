import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: vars.spacing[12],
  border: `1px solid ${vars.color.gray[200]}`,
  borderRadius: "8px",
  gap: vars.spacing[3],
  margin: 0,
  padding: `0 ${vars.spacing[4]}`,
  boxShadow: vars.shadow.md,
});

export const decoration: string = style({
  flex: "0 0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const submit: string = style([
  buttonStyle({ variant: Variant.emerald, iconButton: true }),
  {
    cursor: "pointer",
  },
]);
export const cancel: string = style([
  buttonStyle({ variant: Variant.cerise, iconButton: true }),
  {
    cursor: "pointer",
  },
]);

export const voterMode: string = style([
  buttonStyle({ variant: Variant.orange, iconButton: true }),
  support.transition.all,
  {
    flex: "0 1 auto",
    padding: vars.spacing[1],
    marginRight: vars.spacing[1],
    color: vars.color.orange[800],
    cursor: "pointer",
  },
]);
