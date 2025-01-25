export default async function lazyImport<T>(mod: Promise<T>, delay = 250): Promise<T> {
  let t: any;

  return await Promise.all([
    mod,
    new Promise((resolve) => {
      t = setTimeout(resolve, delay);
    }).then(() => clearTimeout(t)),
  ]).then(([mod]) => mod);
}
