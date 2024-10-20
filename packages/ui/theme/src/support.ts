/**
 * Add opacity with defined color.
 *
 * @param color color with opacity
 * @param opacity opacity to append to the color
 */
export const alpha = function alpha(color: string, opacity: number) {
  return `color-mix(in srgb, ${color} ${opacity}%, transparent)`;
};
