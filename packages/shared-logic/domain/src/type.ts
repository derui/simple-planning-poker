// type for nominal typing
const _brand: unique symbol = Symbol.for("spp/brand");

export type Branded<T, U extends symbol> = T & { [_brand]: U };

/**
 * Unbrand of type `T` with brand.
 */
export type Unbranded<T, U extends symbol> = T extends Branded<T, U> ? T : never;

// alias of string of DateTime. This type is base type of operations.
// format is `YYYY-MM-DDTHH:mm:ss.MMMMMMMZ`
export type DateTime = string;

/**
 * A simple wrapper of `Date`
 */
export const parseDateTime = function parseDateTime(dateTime: DateTime): Date {
  return new Date(Date.parse(dateTime));
};

/**
 * A simple wrapper of converting `Date` to `DateTime`
 */
export const dateTimeToString = function dateTimeToString(date: Date): DateTime {
  return date.toISOString();
};
