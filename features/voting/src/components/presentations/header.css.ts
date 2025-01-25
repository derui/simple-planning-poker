import { Variant } from "@spp/shared-color-variant";
import { buttonStyle } from "@spp/ui-button-style";
import { style } from "@vanilla-extract/css";

export const root: string = style({
  display: "grid",
  gridTemplateRows: "repeat(1, 1fr)",
  gridTemplateColumns: "auto 1fr auto",
});

export const buttonContainer: string = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export const copyButton: string = style([buttonStyle({ variant: Variant.cerise })]);
