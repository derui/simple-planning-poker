import { signIn } from "./_helper.js";
import { expect, test } from "./extended-test.js";

test("change theme", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  // change theme of the current voting
  await page.getByLabel("edit").first().click();
  await page.getByPlaceholder("No theme").fill("changed");
  await page.getByLabel("submit").click();

  await expect(page.getByText("changed")).toBeVisible();
  await expect(other.getByText("changed")).toBeVisible();

  // estimate and show down
  await page.getByText("3", { exact: true }).click();
  await page.getByRole("button", { name: "Reveal" }).click();

  // show same theme
  await expect(page.getByText("changed").first()).toBeVisible();
  await expect(other.getByText("changed").first()).toBeVisible();
});

test("reset theme", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  // change theme of the current voting
  await page.getByLabel("edit").first().click();
  await page.getByPlaceholder("No theme").fill("changed");
  await page.getByLabel("submit").click();

  await expect(page.getByText("changed")).toBeVisible();
  await expect(page.getByText("changed")).toBeVisible();

  // change theme of the current voting
  await page.getByLabel("edit").first().click();
  await page.getByPlaceholder("No theme").clear();
  await page.getByLabel("submit").click();

  await expect(page.getByText("No theme")).toBeVisible();
  await expect(other.getByText("No theme")).toBeVisible();
});
