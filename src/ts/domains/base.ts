import { v4 } from "uuid";

// generic ID type
export type Id<T extends string> = string & { [key in T]: never };

export const idToString = <T extends string>(v: Id<T>): string => v as string;
export const equalId = <T extends string>(v1: Id<T>, v2: Id<T>) => (v1 as string) === (v2 as string);

export const createId = <T extends string>(constant: string | undefined = undefined): Id<T> =>
  (constant || v4()) as Id<T>;
