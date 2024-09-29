const physicalEqual = <T>(v1: T, v2: T): boolean => {
  return v1 === v2;
};

/**
 * get new array that contains only unique elements from original array
 * @param array requested array
 * @param compare comparison function to get unique. Default is physical equal.
 * @return A uniquified array. It is new object.
 */
export const unique = function unique<T>(array: T[], compare: (v1: T, v2: T) => boolean = physicalEqual): T[] {
  const accum: T[] = [];

  return array.reduce((accum, v) => {
    if (accum.some((v1) => compare(v, v1))) {
      return accum;
    }
    accum.push(v);
    return accum;
  }, accum);
};

/**
 * get range between `start` and `end`. An array returned this function has range (start <= value < end)
 */
export const between = function between(start: number, end: number): number[] {
  if (start < 0 || end < 0) {
    return [];
  }

  if (start >= end) {
    return [];
  }

  const array = new Array<number>(end - start);

  for (let i = 0; i < end - start; i++) {
    array[i] = start + i;
  }

  return array;
};
