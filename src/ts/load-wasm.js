import wasmFile from '../rust/planning_poker/pkg/index_bg.wasm';
async function loadWasm() {
  let wasm = (await import("../rust/planning_poker/pkg/index")).default;

  await wasm(wasmFile);
}

loadWasm();
