import { test, expect } from "./extended-test.js";
import { signIn } from "./_helper.js";

test("change user name and mode", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  await resetFirebase();

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
  await page.getByPlaceholder("e.g. A sprint").fill("CI sample");
  await page.getByRole("button", { name: "Submit" }).click();

  // move to select game page
  const link = page.getByRole("link", { name: "CI sample" });

  // open game
  await link.click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const token = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.getByPlaceholder(/Paste invitation token/).fill(token);
  await other.getByRole("button", { name: "Join" }).click();

  // update joined user in other page
  await expect(page.getByTestId("estimations/test2@example.com/root")).toBeVisible();
  await expect(other.getByTestId("estimations/test2@example.com/root")).toBeVisible();

  // change user mode to inspector
  await page.getByTestId("user-info/indicator").click();
  await page.getByTestId("user-info/updater/inspector/root").click();
  await page.getByTestId("user-info/updater/nameEditorInput").clear();
  await page.getByTestId("user-info/updater/nameEditorInput").fill("changed");
  await page.getByTestId("user-info/updater/submit").click();

  // change user mode
  await expect(page.getByTestId("estimations/changed/root")).toHaveText("changed");
  await expect(page.getByTestId("estimations/changed/card")).toHaveAttribute("data-mode", "inspector");
  await expect(other.getByTestId("estimations/changed/root")).toHaveText("changed");
  await expect(other.getByTestId("estimations/changed/card")).toHaveAttribute("data-mode", "inspector");
});

test("inspector can show down", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
  await resetFirebase();

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
  await page.getByPlaceholder("e.g. A sprint").fill("CI sample");
  await page.getByRole("button", { name: "Submit" }).click();

  // move to select game page
  const link = page.getByRole("link", { name: "CI sample" });

  // open game
  await link.click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const token = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.getByPlaceholder(/Paste invitation token/).fill(token);
  await other.getByRole("button", { name: "Join" }).click();

  // update joined user in other page
  await expect(page.getByTestId("estimations/test2@example.com/root")).toBeVisible();
  await expect(other.getByTestId("estimations/test2@example.com/root")).toBeVisible();

  // change user mode to inspector
  await page.getByTestId("user-info/indicator").click();
  await page.getByTestId("user-info/updater/inspector/root").click();
  await page.getByTestId("user-info/updater/submit").click();

  // estimation
  await other.getByText("3", { exact: true }).click();

  // show down
  const showDownButton = page.getByRole("button", { name: "Show down!" });
  const showDownButtonOnOtherPage = other.getByRole("button", { name: "Show down!" });
  await expect(showDownButton).toBeVisible();
  await expect(showDownButton).toBeEnabled();
  await expect(showDownButtonOnOtherPage).toBeVisible();
  await expect(showDownButtonOnOtherPage).toBeEnabled();

  await showDownButton.click();

  // invisible show down button
  await expect(showDownButton).toBeHidden();
  await expect(showDownButtonOnOtherPage).toBeHidden();

  // show result
  const nextRoundButton = page.getByRole("button", { name: "Start next round" });
  const nextRoundButtonOnOtherPage = other.getByRole("button", { name: "Start next round" });

  await expect(nextRoundButton).toBeEnabled();
  await expect(nextRoundButtonOnOtherPage).toBeEnabled();

  await expect(page.getByTestId("estimations/test2@example.com/card")).toHaveText("3");
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeEmpty();
  await expect(other.getByTestId("estimations/test2@example.com/card")).toHaveText("3");
  await expect(other.getByTestId("estimations/test@example.com/card")).toBeEmpty();

  await expect(page.getByTestId("resultCard")).toContainText("3");
  await expect(other.getByTestId("resultCard")).toContainText("3");

  await expect(page.getByTestId("average")).toContainText("Score3");
  await expect(other.getByTestId("average")).toContainText("Score3");
});
