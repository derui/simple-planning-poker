import { Variant } from "@spp/shared-color-variant";
import { support, vars } from "@spp/ui-theme";
import { style, styleVariants } from "@vanilla-extract/css";

const base = style({
  paddingLeft: vars.spacing[4],
  paddingRight: vars.spacing[4],
  paddingTop: vars.spacing[2],
  paddingBottom: vars.spacing[2],
  borderRadius: "4px",
});

const iconBase = style({
  padding: vars.spacing[2],
  borderRadius: "9999px",
});

const disabledBase = style([
  base,
  {
    cursor: "not-allowed",
  },
]);

const enabledBase = style([
  base,
  support.transition.all,
  {
    ":active": {
      boxShadow: vars.shadow.xl,
    },
  },
]);

const disabledIconBase = style([
  iconBase,
  {
    cursor: "not-allowed",
  },
]);

const enabledIconBase = style([
  iconBase,
  support.transition.all,
  {
    ":active": {
      boxShadow: vars.shadow.xl,
    },
  },
]);

const variants = {
  [Variant.gray]: {
    borderColor: vars.color.gray[500],
    backgroundColor: vars.color.gray[50],
    color: vars.color.gray[900],
    ":hover": {
      backgroundColor: vars.color.gray[200],
    },
    ":active": {
      backgroundColor: vars.color.gray[300],
    },
  },
  [Variant.blue]: {
    borderColor: vars.color.blue[300],
    backgroundColor: vars.color.blue[200],
    color: vars.color.blue[900],
    ":hover": {
      backgroundColor: vars.color.blue[200],
    },
    ":active": {
      backgroundColor: vars.color.blue[300],
    },
  },
  [Variant.teal]: {
    borderColor: vars.color.teal[300],
    backgroundColor: vars.color.teal[200],
    color: vars.color.teal[900],
    ":hover": {
      backgroundColor: vars.color.teal[200],
    },
    ":active": {
      backgroundColor: vars.color.teal[300],
    },
  },
  [Variant.emerald]: {
    borderColor: vars.color.emerald[300],
    backgroundColor: vars.color.emerald[200],
    color: vars.color.emerald[900],
    ":hover": {
      backgroundColor: vars.color.emerald[200],
    },
    ":active": {
      backgroundColor: vars.color.emerald[300],
    },
  },
  [Variant.orange]: {
    borderColor: vars.color.orange[300],
    backgroundColor: vars.color.orange[200],
    color: vars.color.orange[900],
    ":hover": {
      backgroundColor: vars.color.orange[200],
    },
    ":active": {
      backgroundColor: vars.color.orange[300],
    },
  },
  [Variant.chestnut]: {
    borderColor: vars.color.chestnut[300],
    backgroundColor: vars.color.chestnut[200],
    color: vars.color.chestnut[900],
    ":hover": {
      backgroundColor: vars.color.chestnut[200],
    },
    ":active": {
      backgroundColor: vars.color.chestnut[300],
    },
  },
  [Variant.cerise]: {
    borderColor: vars.color.cerise[300],
    backgroundColor: vars.color.cerise[200],
    color: vars.color.cerise[900],
    ":hover": {
      backgroundColor: vars.color.cerise[200],
    },
    ":active": {
      backgroundColor: vars.color.cerise[300],
    },
  },
  [Variant.purple]: {
    borderColor: vars.color.purple[300],
    backgroundColor: vars.color.purple[200],
    color: vars.color.purple[900],
    ":hover": {
      backgroundColor: vars.color.purple[200],
    },
    ":active": {
      backgroundColor: vars.color.purple[300],
    },
  },
  [Variant.indigo]: {
    borderColor: vars.color.indigo[300],
    backgroundColor: vars.color.indigo[200],
    color: vars.color.indigo[900],
    ":hover": {
      backgroundColor: vars.color.indigo[200],
    },
    ":active": {
      backgroundColor: vars.color.indigo[300],
    },
  },
};

export const disabledButtonVariants = styleVariants(variants, (variant) => [
  disabledBase,
  {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: variant.borderColor,
    backgroundColor: variant.backgroundColor,
    color: variant.color,
  },
]);

export const disabledIconButtonVariants = styleVariants(variants, (variant) => [
  disabledIconBase,
  {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: variant.borderColor,
    backgroundColor: variant.backgroundColor,
    color: variant.color,
  },
]);

export const enabledButtonVariants = styleVariants(variants, (variant) => [
  enabledBase,
  {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: variant.borderColor,
    backgroundColor: variant.backgroundColor,
    color: variant.color,
    ":hover": variant[":hover"],
    ":active": variant[":active"],
  },
]);

export const enabledIconButtonVariants = styleVariants(variants, (variant) => [
  enabledIconBase,
  {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: variant.borderColor,
    backgroundColor: variant.backgroundColor,
    color: variant.color,
    ":hover": variant[":hover"],
    ":active": variant[":active"],
  },
]);
