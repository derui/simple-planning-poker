import { v4 } from "uuid";

// generic ID type
export type Id<T extends string> = string & { [key in T]: never };

export const createId = <T extends string>(): Id<T> => v4() as Id<T>;
