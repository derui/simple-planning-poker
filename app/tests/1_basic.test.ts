import { signIn } from "./_helper.js";
import { expect, test } from "./extended-test.js";

test("sign in and select game", async ({ page, resetFirebase }) => {
  await resetFirebase();

  await page.goto(`/`);

  // should redirect to  sign in page.
  await expect(page).toHaveURL("/");

  await page.getByText("Sign Up").click();

  // sign up
  await signIn(page, "test@example.com", "password");

  // move to select game
  await expect(page).toHaveURL(/game$/);
  await expect(page.getByText("Select game from list")).toBeVisible();
  await expect(page.getByText("test@example.com")).toBeVisible();
  await expect(page.getByText("Add Game")).toBeVisible();
});

test("create and join game", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  await resetFirebase();

  // sign up main
  await page.goto(`/`);
  await page.getByText("Sign Up").click();
  await signIn(page, "test@example.com", "password");

  // sign up other
  await other.goto(`/`);
  await other.getByText("Sign Up").click();
  await signIn(other, "test2@example.com", "password");

  // create game
  await page.getByText("Add Game").click();
  await page.getByPlaceholder("e.g. A sprint").fill("CI sample");
  await page.getByLabel("Points").fill("1,2,3,5");

  const submit = page.getByRole("button", { name: "Submit" });
  await submit.click();

  // move to select game page
  const link = page.getByText("CI sample");
  await expect(page).toHaveURL(/game\/$/);
  await expect(link).toBeVisible();

  // open game
  await link.click();
  await page.getByRole("button", { name: "Start Voting" }).click();

  // expect game pages
  await expect(page.getByText("Voted")).toBeVisible();
  await expect(page.getByText("No inspectors")).toBeVisible();

  for (const card of [1, 2, 3, 5]) {
    await expect(page.getByText(`${card}`, { exact: true })).toBeVisible();
  }

  // join game with other
  const votingUrl = page.url();
  await other.goto(votingUrl);

  await expect(other).toHaveURL(page.url());
  await expect(other.getByText("No inspectors")).toBeVisible();
  await expect(other.getByText("test@example.com")).toBeVisible();
  await expect(other.getByText("test2@example.com")).toBeVisible();

  // update joined user in other page
  await expect(other.getByText("test2@example.com")).toBeVisible();

  // estimation synchronize each page
  await page.getByRole("tab", { name: "3" }).click();
});

test("result game", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  await resetFirebase();

  // sign up main
  await page.goto(`/`);
  await page.getByText("Sign Up").click();
  await signIn(page, "test@example.com", "password");

  // sign up other
  await other.goto(`/`);
  await other.getByText("Sign Up").click();
  await signIn(other, "test2@example.com", "password");

  // create game
  await page.getByText("Add Game").click();
  await page.getByPlaceholder("e.g. A sprint").fill("CI sample");
  await page.getByLabel("Points").fill("1,2,3,5");

  const submit = page.getByRole("button", { name: "Submit" });
  await submit.click();

  // start new voting
  await page.getByText("CI sample").click();
  await page.getByRole("button", { name: "Start Voting" }).click();

  await expect(page.getByText("Voted")).toBeVisible();

  // join game with other
  await other.goto(page.url());
  await expect(other).toHaveURL(page.url());
  await expect(other.getByText("No inspectors")).toBeVisible();
  await expect(other.getByText("test@example.com")).toBeVisible();
  await expect(other.getByText("test2@example.com")).toBeVisible();

  // estimation
  await page.getByRole("tab", { name: "3" }).click();

  // show down
  const revealButton = page.getByRole("button", { name: "Reveal" });
  const revealButtonOnOtherPage = other.getByRole("button", { name: "Reveal" });
  await expect(revealButton).toBeVisible();
  await expect(revealButton).toBeEnabled();
  await expect(revealButtonOnOtherPage).toBeVisible();
  await expect(revealButtonOnOtherPage).toBeEnabled();

  await revealButton.click();

  // show result
  await expect(page).toHaveURL(/revealed\/?$/);
  await expect(other).toHaveURL(/revealed\/?$/);
  const resetButton = page.getByRole("button", { name: "Reset" });
  const resetButtonOnOtherPage = other.getByRole("button", { name: "Reset" });

  await expect(resetButton).toBeEnabled();
  await expect(resetButtonOnOtherPage).toBeEnabled();

  await expect(page.getByText("test@example.com3")).toBeVisible();
  await expect(page.getByText("test2@example.com?")).toBeVisible();

  await expect(page.getByText("Estimation(Average):3.0")).toBeVisible();

  // start next round.
  await resetButton.click();

  await expect(page).not.toHaveURL(/revealed\/?$/);
  await expect(other).not.toHaveURL(/revealed\/?$/);

  await expect(page.locator("div").filter({ hasText: /^test@example\.com$/ })).toBeVisible();
  await expect(page.locator("div").filter({ hasText: /^test2@example\.com$/ })).toBeVisible();
  await expect(other.locator("div").filter({ hasText: /^test@example\.com$/ })).toBeVisible();
  await expect(other.locator("div").filter({ hasText: /^test2@example\.com$/ })).toBeVisible();

  for (const card of [1, 2, 3, 5]) {
    await expect(page.getByText(`${card}`, { exact: true })).toBeVisible();
    await expect(other.getByText(`${card}`, { exact: true })).toBeVisible();
  }
});

test("re-open and restore current round", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  await resetFirebase();

  // sign up main
  await page.goto(`/`);
  await page.getByText("Sign Up").click();
  await signIn(page, "test@example.com", "password");

  // sign up other
  await other.goto(`/`);
  await other.getByText("Sign Up").click();
  await signIn(other, "test2@example.com", "password");

  // create game
  await page.getByText("Add Game").click();
  await page.getByPlaceholder("e.g. A sprint").fill("CI sample");
  await page.getByLabel("Points").fill("1,2,3,5");

  const submit = page.getByRole("button", { name: "Submit" });
  await submit.click();

  // move to select game page
  const link = page.getByText("CI sample");
  await expect(page).toHaveURL(/game\/$/);
  await expect(link).toBeVisible();

  // open game
  await link.click();
  await page.getByRole("button", { name: "Start Voting" }).click();

  await expect(page.getByText("Voted")).toBeVisible();

  // join game with other
  await other.goto(page.url());
  await expect(other).toHaveURL(page.url());
  await expect(other.getByText("No inspectors")).toBeVisible();
  await expect(other.getByText("test@example.com")).toBeVisible();
  await expect(other.getByText("test2@example.com")).toBeVisible();

  await page.getByText("3", { exact: true }).click();

  // re-open and restore information
  await other.goto("/game");
  await other.goto(page.url());

  await expect(other.getByText("No inspectors")).toBeVisible();
  await expect(other.getByText("test@example.com")).toBeVisible();
  await expect(other.getByText("test2@example.com")).toBeVisible();
});
