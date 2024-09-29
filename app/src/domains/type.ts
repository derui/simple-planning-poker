// type for nominal typing
export type Branded<T, U extends symbol> = T & { [key in U]: never };

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
