/**
 * A guard to filter undefined
 */
export const filterUndefined = function filterUndefined<T>(value: T | undefined | null): value is NonNullable<T> {
  return value !== undefined && value !== null;
};
