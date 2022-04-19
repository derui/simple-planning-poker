export default async function lazyImport<T>(mod: Promise<T>, delay = 500) {
  let t: any;

  return await Promise.all([
    mod,
    new Promise((resolve) => {
      t = setTimeout(resolve, delay);
    }).then(() => clearTimeout(t)),
  ]).then(([mod]) => mod);
}
