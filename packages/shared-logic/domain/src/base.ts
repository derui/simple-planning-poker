import { v4 } from "uuid";

/**
 * The Generic ID type in domain
 */
export type Id<T extends string> = string & { [key in T]: never };

/**
 * Stringify for `ID` Type
 */
export const toString = <T extends string>(v: Id<T>): string => v as string;

/**
 * Create new ID with or without identifier. When without identifier,
 * this function generate randomly unique ID.
 */
export const create = <T extends string>(constant: string | undefined = undefined): Id<T> =>
  (constant || v4()) as Id<T>;
