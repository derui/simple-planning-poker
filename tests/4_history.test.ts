import { test, expect } from "./extended-test.js";
import { signIn } from "./_helper.js";

test("show history after finished round", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  // open game
  await page.getByRole("link", { name: "CI sample" }).click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const token = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.getByPlaceholder(/Paste invitation token/).type(token);
  await other.getByRole("button", { name: "Join" }).click();
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeVisible();

  // estimation
  await page.getByText("3", { exact: true }).click();

  // show down
  const showDownButton = page.getByRole("button", { name: "Show down!" });
  await showDownButton.click();

  // show result and next round
  const nextRoundButton = page.getByRole("button", { name: "Start next round" });

  // start next round.
  await nextRoundButton.click();
  await expect(other.getByText(/Waiting to/)).toBeVisible();

  // estimate and finishd round
  await other.getByText("3", { exact: true }).click();
  await showDownButton.click();

  // open round histories panel
  await page.getByTestId("sidebar/pullTab").click();
  await expect(page.getByTestId("sidebar/root")).toBeVisible();
  await expect(page.getByTestId(/sidebar\/round\/[a-zA-Z0-9\-]+\/root/)).toBeVisible();

  // Show round history
  await page.getByTestId(/sidebar\/round\/[a-zA-Z0-9\-]+\/root/).click();
  await expect(page).toHaveURL(/history$/);

  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test@example.com/card")).toHaveText("3");
  // do not show player if did not estimate on the history
  await expect(page.getByTestId("estimations/test2@example.com/card")).not.toBeVisible();
});
