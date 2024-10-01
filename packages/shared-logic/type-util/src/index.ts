// Export only shared `logic`. Please DO NOT EXPORT internal state or internal dependency

/**
 * type prettifier
 *
 * https://www.totaltypescript.com/concepts/the-prettify-helper
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
