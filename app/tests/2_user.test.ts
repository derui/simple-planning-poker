import { signIn } from "./_helper.js";
import { expect, test } from "./extended-test.js";

test("change user name and mode", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  // change user mode to inspector
  await page.getByText("Player").click();

  // change user mode
  await expect(page.getByText("Inspectors", { exact: true })).not.toBeVisible();
  await expect(page.getByText("No Inspectors")).not.toBeVisible();
  await expect(page.getByText("Inspector mode")).toBeVisible();
  await expect(page.getByText("Voted0 / 1Revealtest2@example")).toBeVisible();
  await expect(other.getByText("Voted0 / 1Revealtest2@example")).toBeVisible();
});

test("inspector can reveal", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  // change user mode to inspector
  await page.getByText("Player").click();

  // estimation
  await other.getByText("3", { exact: true }).click();

  // show down
  const revealButton = page.getByRole("button", { name: "Reveal" });
  const revealButtonOnOtherPage = other.getByRole("button", { name: "Reveal" });
  await expect(revealButton).toBeVisible();
  await expect(revealButton).toBeEnabled();
  await expect(revealButtonOnOtherPage).toBeVisible();
  await expect(revealButtonOnOtherPage).toBeEnabled();

  await revealButton.click();

  // show result
  const resetButton = page.getByRole("button", { name: "Reset" });
  const resetButtonOnOtherPage = other.getByRole("button", { name: "Reset" });

  await expect(resetButton).toBeEnabled();
  await expect(resetButtonOnOtherPage).toBeEnabled();

  await expect(page.getByText("test2@example.com3")).toBeVisible();

  await expect(page.getByText("Estimation(Average):3.0")).toBeVisible();
});
