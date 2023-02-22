/**
 * A guard to filter undefined
 */
export const filterUndefined = function filterUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
};
