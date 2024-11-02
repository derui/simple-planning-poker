import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "auto 1fr auto",
  gridTemplateColumns: "1fr",
  placeItems: "center",
  gap: vars.spacing[4],
});

export const loading: string = style({
  display: "grid",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "1fr",
  placeContent: "center",
  height: vars.spacing[24],
  width: "100%",
});

export const estimations: string = style({
  display: "flex",
  flexDirection: "row",
  gap: vars.spacing[4],
});

export const votingRoot: string = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: vars.spacing[8],
});

export const votingLabel: string = style({
  flex: "0 0 auto",
  fontSize: vars.font.size["2xl"],
  lineHeight: vars.font.lineHeight["2xl"],
  fontWeight: "bold",
  color: vars.color.emerald[700],
  marginRight: vars.spacing[4],
});

export const votingAverage: string = style([
  support.transition.all,
  {
    flex: "1 1 auto",
    fontSize: vars.font.size.lg,
    lineHeight: vars.font.lineHeight.lg,
    borderRadius: "4px",
    padding: `${vars.spacing[1]} ${vars.spacing[2]}`,
    fontWeight: "bold",
    backgroundColor: vars.color.cerise[100],
    border: `1px solid ${vars.color.cerise[400]}`,
    color: vars.color.emerald[700],
  },
]);

export const reset: string = style({
  display: "flex",
});

export const resetButton: string = buttonStyle({ variant: Variant.orange });
