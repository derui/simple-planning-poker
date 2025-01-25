import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "repeat(1, 1fr)",
  gridTemplateColumns: "auto 1fr auto",
});

export const buttonContainer: string = style([
  {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: vars.spacing[2],
    marginRight: vars.spacing[7],
  },
]);

export const copyButton: string = style([buttonStyle({ variant: Variant.indigo, iconButton: true })]);
