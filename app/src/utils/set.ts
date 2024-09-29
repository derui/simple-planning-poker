export const isSuperset = function isSuperSet<T>(baseSet: Set<T>, subset: Set<T>) {
  for (const elem of subset) {
    if (!baseSet.has(elem)) {
      return false;
    }
  }
  return true;
};
