import { test, expect } from "./extended-test.js";
import { signIn } from "./_helper.js";

test("change theme", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  resetFirebase();

  // sign up main
  await page.goto(`/`);
  await page.getByText("Sign up").click();
  await signIn(page, "test@example.com", "password");

  // sign up other
  await other.goto(`/`);
  await other.getByText("Sign up").click();
  await signIn(other, "test2@example.com", "password");

  // create game
  await page.getByRole("button", { name: "Create Game" }).click();
  await page.getByPlaceholder("e.g. A sprint").type("CI sample");
  await page.getByRole("button", { name: "Submit" }).click();

  // move to select game page
  await page.getByRole("link", { name: "CI sample" }).click();

  // change theme of the round
  await page.getByText("No theme").click();
  await page.getByPlaceholder("Theme of round").type("changed");
  await page.getByTestId("themeEditor/editor/submit").click();

  await expect(page.getByText("changed")).toBeVisible();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const token = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.getByPlaceholder(/Paste invitation token/).type(token);
  await other.getByRole("button", { name: "Join" }).click();

  // show same theme.
  await expect(other.getByText("changed")).toBeVisible();

  // estimate and show down
  await page.getByText("3", { exact: true }).click();
  await page.getByRole("button", { name: "Show down!" }).click();

  // show same theme
  await expect(page.getByText("changed")).toBeVisible();
  await expect(other.getByText("changed")).toBeVisible();
});

test("reset theme", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  resetFirebase();

  // sign up main
  await page.goto(`/`);
  await page.getByText("Sign up").click();
  await signIn(page, "test@example.com", "password");

  // sign up other
  await other.goto(`/`);
  await other.getByText("Sign up").click();
  await signIn(other, "test2@example.com", "password");

  // create game
  await page.getByRole("button", { name: "Create Game" }).click();
  await page.getByPlaceholder("e.g. A sprint").type("CI sample");
  await page.getByRole("button", { name: "Submit" }).click();

  // move to select game page
  await page.getByRole("link", { name: "CI sample" }).click();

  // change theme of the round
  await page.getByText("No theme").click();
  await page.getByPlaceholder("Theme of round").type("changed");
  await page.getByTestId("themeEditor/editor/submit").click();

  await expect(page.getByText("changed")).toBeVisible();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const token = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.getByPlaceholder(/Paste invitation token/).type(token);
  await other.getByRole("button", { name: "Join" }).click();

  // show same theme.
  await expect(other.getByText("changed")).toBeVisible();

  // reset theme when cleared
  await other.getByText("changed").click();
  await other.getByPlaceholder("Theme of round").clear();
  await other.getByTestId("themeEditor/editor/submit").click();

  await expect(page.getByText("No theme")).toBeVisible();
  await expect(other.getByText("No theme")).toBeVisible();
});
