import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { support, vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root = style({
  display: "grid",
  gridTemplateRows: "auto auto 1fr",
  gridTemplateColumns: "1fr",
  placeItems: "center",
  gap: vars.spacing[4],
});
export const loading = style({
  display: "grid",
  gridTemplateRows: "1fr",
  gridTemplateColumns: "1fr",
  placeContent: "center",
  height: vars.spacing[24],
  width: "100%",
});
export const estimations = style({
  display: "flex",
  flexDirection: "row",
  gap: vars.spacing[4],
});

export const votingRoot = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  height: vars.spacing[16],
});
export const votingLabel = style({
  fontSize: vars.font.size["2xl"],
  lineHeight: vars.font.lineHeight["2xl"],
  fontWeight: "bold",
  color: vars.color.emerald[700],
});
export const votingEstimated = style([
  support.transition.all,
  {
    flex: "1 1 auto",
    fontSize: vars.font.size.lg,
    lineHeight: vars.font.lineHeight.lg,
    borderRadius: "4px",
    border: "1ps solid transparent",
    padding: `${vars.spacing[2]} ${vars.spacing[4]}`,
  },
]);

export const votingEstimatedNotAllEstimated = style([
  votingEstimated,
  {
    color: vars.color.gray[800],
    borderColor: vars.color.gray[400],
  },
]);

export const votingEstimatedAllEstimated = style([
  votingEstimated,
  {
    color: vars.color.emerald[700],
    fontWeight: "bold",
    backgroundColor: vars.color.cerise[100],
    borderColor: vars.color.cerise[400],
  },
]);
export const votingRevealButtonEnabled = buttonStyle({ variant: Variant.emerald });
export const votingRevealButtonDisbled = buttonStyle({ variant: Variant.emerald, disabled: true });

export const votingReveal = style({
  display: "flex",
  flex: "1 1 auto",
  marginLeft: vars.spacing[4],
});
