const physicalEqual = <T>(v1: T, v2: T): boolean => {
  return v1 === v2;
};

/**
 * get new array that contains only unique elements from original array
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

  const array = new Array(end - start);

  for (let i = 0; i < end - start; i++) {
    array[i] = start + i;
  }

  return array;
};
