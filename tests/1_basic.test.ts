import { test, expect } from "./extended-test.js";
import { signIn } from "./_helper.js";

test("sign in and select game", async ({ page, resetFirebase }) => {
  resetFirebase();

  await page.goto(`/`);

  // should redirect to  sign in page.
  await expect(page).toHaveURL("/signin");

  await page.getByText("Sign up").click();

  // sign up
  await signIn(page, "test@example.com", "password");

  // move to select game
  await expect(page).toHaveURL(/game$/);
  await expect(page.getByText("Select game you already joined")).toBeVisible();
  await expect(page.getByText("You do not have games that you are invited before.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create Game" })).toBeVisible();
});

test("create and join game", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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
  const submit = page.getByRole("button", { name: "Submit" });
  await expect(submit).toBeDisabled();

  await page.getByPlaceholder("e.g. A sprint").type("CI sample");
  await expect(submit).toBeEnabled();

  await submit.click();

  // move to select game page
  const link = page.getByRole("link", { name: "CI sample" });
  await expect(page).toHaveURL(/game$/);
  await expect(link).toBeVisible();

  // open game
  await link.click();

  // expect game pages
  await expect(page.getByTestId("waiting")).toHaveText("Waiting to select card...");
  await expect(page.getByTestId("hands/hand/root")).toHaveText("test@example.com");

  for (let card of [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]) {
    await expect(page.getByText(`${card}`, { exact: true })).toBeVisible();
  }

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);

  await expect(other).toHaveURL(page.url());
  await expect(other.getByTestId("waiting")).toHaveText("Waiting to select card...");
  await expect(other.getByTestId("hands/hand/root").getByText("test2@example.com")).toBeVisible();

  // update joined user in other page
  await expect(page.getByTestId("hands/hand/root").getByText("test2@example.com")).toBeVisible();
});
