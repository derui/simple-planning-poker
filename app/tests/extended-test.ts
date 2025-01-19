import { test as base, type Page } from "@playwright/test";
import * as fs from "node:fs";

export const test = base.extend<{ newPageOnNewContext: Page; resetFirebase: () => Promise<void> }>({
  newPageOnNewContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await use(page);

    await page.close();
    await context.close();
  },
  resetFirebase: async ({ request }, use) => {
    await use(() => {
      return Promise.resolve();
    });

    const firebaserc = JSON.parse(fs.readFileSync("../.firebaserc").toString());

    await request.delete(`http://localhost:9099/emulator/v1/projects/${firebaserc.projects.default}/accounts`, {
      headers: { authorization: "Bearer owner" },
    });
  },
});

export { expect } from "@playwright/test";
