import { test as base, type Page } from "@playwright/test";
import { initializeApp } from "firebase/app";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { v4 } from "uuid";

export const test = base.extend<{ initializedProjectId: string; newPageOnNewContext: Page }>({
  initializedProjectId: async ({}, use) => {
    const projectId = v4();

    const firebaseApp = initializeApp({ projectId, apiKey: "api" });

    const database = getDatabase(firebaseApp);
    connectDatabaseEmulator(database, "localhost", 9000);

    await use(projectId);
  },

  newPageOnNewContext: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    await use(page);

    await page.close();
    await context.close();
  },
});

export { expect } from "@playwright/test";
