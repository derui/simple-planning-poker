import { VariantName } from "@spp/shared-color-variant";
import clsx from "clsx";

export interface Props {
  /**
   * Base color of button. These colors are based on color system.
   */
  variant: VariantName;

  /**
   * Add style for disabled state.
   */
  disabled?: boolean;

  /**
   * Use full-rounded style instead of default button style
   */
  iconButton?: boolean;
}

/**
 * Common button style.
 */
const commonStyles = (props: Props) =>
  clsx("py-2", {
    "px-4": !props.iconButton,
    rounded: !props.iconButton,
    "px-2": props.iconButton,
    "rounded-full": props.iconButton,
  });

const enabledStyles = ["transition", "active:shadow-xl"];

/**
 * Style of variant that are defined for tailwindcss
 */
const variantStyles: Record<string, (props: Props) => string> = {
  gray: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-gray-700",
      "bg-gray-50",
      "text-gray-900",
      "hover:bg-gray-200",
      "active:bg-gray-300"
    ),
  blue: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-blue-300",
      "bg-blue-200",
      "text-blue-900",
      "hover:bg-blue-200",
      "active:bg-blue-300"
    ),
  teal: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-teal-300",
      "bg-teal-200",
      "text-teal-900",
      "hover:bg-teal-200",
      "active:bg-teal-300"
    ),
  emerald: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-emerald-300",
      "bg-emerald-200",
      "text-emerald-900",
      "hover:bg-emerald-200",
      "active:bg-emerald-300"
    ),
  orange: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-orange-300",
      "bg-orange-200",
      "text-orange-900",
      "hover:bg-orange-200",
      "active:bg-orange-300"
    ),
  chestnut: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-chestnut-300",
      "bg-chestnut-200",
      "text-chestnut-900",
      "hover:bg-chestnut-200",
      "active:bg-chestnut-300"
    ),
  cerise: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-cerise-300",
      "bg-cerise-200",
      "text-cerise-900",
      "hover:bg-cerise-200",
      "active:bg-cerise-300"
    ),
  purple: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-purple-300",
      "bg-purple-200",
      "text-purple-900",
      "hover:bg-purple-200",
      "active:bg-purple-300"
    ),
  indigo: (props: Props) =>
    clsx(
      commonStyles(props),
      ...enabledStyles,
      "border",
      "border-indigo-300",
      "bg-indigo-200",
      "text-indigo-900",
      "hover:bg-indigo-200",
      "active:bg-indigo-300"
    ),
} as const;

const commonDisabledStyles = ["cursor-not-allowed"];

const disabledStyles: Record<string, (props: Props) => string> = {
  gray: (props: Props) =>
    clsx(commonStyles(props), ...commonDisabledStyles, "border", "border-gray-400", "bg-gray-50", "text-gray-600"),
  blue: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-blue-300",
      "bg-blue-200/50",
      "text-blue-900/50"
    ),
  teal: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-teal-300",
      "bg-teal-200/50",
      "text-teal-900/50"
    ),
  emerald: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-emerald-300",
      "bg-emerald-200/50",
      "text-emerald-900/50"
    ),
  orange: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-orange-300",
      "bg-orange-200/50",
      "text-orange-900/50"
    ),
  chestnut: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-chestnut-300",
      "bg-chestnut-200/50",
      "text-chestnut-900/50"
    ),
  cerise: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-cerise-300",
      "bg-cerise-200/50",
      "text-cerise-900/50"
    ),
  purple: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-purple-300",
      "bg-purple-200/50",
      "text-purple-900/50"
    ),
  indigo: (props: Props) =>
    clsx(
      commonStyles(props),
      ...commonDisabledStyles,
      "border",
      "border-indigo-300",
      "bg-indigo-200/50",
      "text-indigo-900/50"
    ),
} as const;

/**
 * Get button style as class name for specified props.
 */
export const buttonStyle = function buttonStyle(props: Props): string {
  const variant = props.disabled ? disabledStyles[props.variant] : variantStyles[props.variant];

  return clsx(variant(props));
};
