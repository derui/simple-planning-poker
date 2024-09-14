#!/usr/bin/env node

import * as F from "@pnpm/find-workspace-dir";
import { cwd } from "node:process";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const main = async function main() {
  const root = await F.findWorkspaceDir(cwd());

  const dotenv = path.resolve(cwd(), ".env");

  try {
    await fs.writeFile(dotenv, `\nSPP_PNPM_ROOT=${root}`, { flag: "a" });
  } catch {
    console.warn(`Can not write .env file at ${dotenv}`);
  }
};

await main();
