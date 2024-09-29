import * as fs from "node:fs";
import { test as base, type Page } from "@playwright/test";

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

    const firebaserc = JSON.parse(fs.readFileSync("./.firebaserc"));

    await request.delete(`http://localhost:9099/emulator/v1/projects/${firebaserc.projects.default}/accounts`, {
      headers: { authorization: "Bearer owner" },
    });

    await request.put(`http://localhost:9000/.json?ns=${firebaserc.projects.default}-default-rtdb`, {
      data: JSON.parse(fs.readFileSync(`./misc/ci/database_export/${firebaserc.projects.default}-default-rtdb.json`)),
      headers: { authorization: "Bearer owner" },
    });
  },
});

export { expect } from "@playwright/test";
