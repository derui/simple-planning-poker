// type for nominal typing
export type Branded<T, U extends symbol> = T & { [key in U]: never };
