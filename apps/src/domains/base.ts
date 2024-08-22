import { v4 } from "uuid";

// generic ID type
export type Id<T extends string> = string & { [key in T]: never };

export const toString = <T extends string>(v: Id<T>): string => v as string;

export const create = <T extends string>(constant: string | undefined = undefined): Id<T> =>
  (constant || v4()) as Id<T>;
