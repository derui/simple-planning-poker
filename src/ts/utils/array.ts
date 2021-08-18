const physicalEqual = function <T>(v1: T, v2: T): boolean {
  return v1 === v2;
};

/**
   get new array that contains only unique elements from original array
 */
export const unique = <T>(array: T[], compare: (v1: T, v2: T) => boolean = physicalEqual): T[] => {
  const accum: T[] = [];

  return array.reduce((accum, v) => {
    if (accum.some((v1) => compare(v, v1))) {
      return accum;
    }
    accum.push(v);
    return accum;
  }, accum);
};
