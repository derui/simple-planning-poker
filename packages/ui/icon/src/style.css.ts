import { Variant } from "@spp/shared-color-variant";
import { vars } from "@spp/ui-theme";
import { style } from "@vanilla-extract/css";

const iconBase = style({
  display: "flex",
  "::before": {
    display: "inline-block",
    content: " ",
    flex: "none",
    maskSize: "cover",
    maskPosition: "center",
    maskRepeat: "no-repeat",
  },
});

export const iconSmall: string = style([
  iconBase,
  {
    "::before": {
      width: vars.spacing[5],
      height: vars.spacing[5],
    },
    width: vars.spacing[5],
    height: vars.spacing[5],
  },
]);

export const iconMedium: string = style([
  iconBase,
  {
    "::before": {
      width: vars.spacing[6],
      height: vars.spacing[6],
    },
    width: vars.spacing[6],
    height: vars.spacing[6],
  },
]);

export const iconLarge: string = style([
  iconBase,
  {
    "::before": {
      width: vars.spacing[7],
      height: vars.spacing[7],
    },
    width: vars.spacing[7],
    height: vars.spacing[7],
  },
]);

export const iconExtraLarge: string = style([
  iconBase,
  {
    "::before": {
      width: vars.spacing[10],
      height: vars.spacing[10],
    },
    width: vars.spacing[10],
    height: vars.spacing[10],
  },
]);

/**
 * A simple function to make icon variant
 */
export const styleVarianter =
  (base: string, icon: string) =>
  (color: string): [string, Record<string, object>] => [
    base,
    {
      "::before": {
        backgroundColor: color,
        maskImage: `url(/static/svg/tabler-icons/${icon}.svg)`,
      },
    },
  ];

export const colorVariants: Record<Variant, string> = {
  [Variant.gray]: vars.color.gray[700],
  [Variant.blue]: vars.color.blue[700],
  [Variant.teal]: vars.color.teal[700],
  [Variant.emerald]: vars.color.emerald[700],
  [Variant.orange]: vars.color.orange[700],
  [Variant.chestnut]: vars.color.chestnut[700],
  [Variant.cerise]: vars.color.cerise[700],
  [Variant.purple]: vars.color.purple[700],
  [Variant.indigo]: vars.color.indigo[700],
};
