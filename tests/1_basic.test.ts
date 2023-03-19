import { test, expect } from "./extended-test.js";
import { signIn } from "./_helper.js";

test("", async ({ page, initializedProjectId, newPageOnNewContext }) => {
  await page.goto(`/?projectId=${initializedProjectId}`);

  // should redirect to  sign in page.
  await expect(page).toHaveURL("/signin");

  // sign up
  await signIn(page, "test@example.com", "password");

  await expect(page).toHaveURL(/game$/);
});
