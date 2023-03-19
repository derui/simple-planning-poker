import { test, expect } from "./extended-test.js";

test("", async ({ page, initializedProjectId, newPageOnNewContext }) => {
  await page.goto(`/?projectId=${initializedProjectId}`);

  // should redirect to  sign in page.
  await expect(page).toHaveURL("/signin");
});
