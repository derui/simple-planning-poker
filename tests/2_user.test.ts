import { test, expect } from "./extended-test.js";
import { signIn } from "./_helper.js";

test("change user name and mode", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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
  const link = page.getByRole("link", { name: "CI sample" });

  // open game
  await link.click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);

  // update joined user in other page
  await expect(page.getByTestId("estimations/test2@example.com/root")).toBeVisible();
  await expect(other.getByTestId("estimations/test2@example.com/root")).toBeVisible();

  // change user mode to inspector
  await page.getByTestId("user-info/indicator").click();
  await page.getByTestId("user-info/updater/inspector/root").click();
  await page.getByTestId("user-info/updater/nameEditorInput").clear();
  await page.getByTestId("user-info/updater/nameEditorInput").type("changed");
  await page.getByTestId("user-info/updater/submit").click();

  // change user mode
  await expect(page.getByTestId("estimations/changed/root")).toHaveText("changed");
  await expect(page.getByTestId("estimations/changed/card")).toHaveAttribute("data-mode", "inspector");
  await expect(other.getByTestId("estimations/changed/root")).toHaveText("changed");
  await expect(other.getByTestId("estimations/changed/card")).toHaveAttribute("data-mode", "inspector");
});
