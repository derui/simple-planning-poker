export default function lazyImport<T>(mod: Promise<T>, delay = 250): Promise<T> {
  return Promise.all([
    mod,
    new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    }),
  ]).then(([module]) => module);
}
