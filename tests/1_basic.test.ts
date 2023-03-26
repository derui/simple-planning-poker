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
  await expect(page.getByTestId("estimations/test@example.com/root")).toHaveText("test@example.com");

  for (let card of [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]) {
    await expect(page.getByText(`${card}`, { exact: true })).toBeVisible();
  }

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);

  await expect(other).toHaveURL(page.url());
  await expect(other.getByTestId("waiting")).toHaveText("Waiting to select card...");
  await expect(other.getByTestId("estimations/test2@example.com/root")).toBeVisible();

  // update joined user in other page
  await expect(page.getByTestId("estimations/test2@example.com/root")).toBeVisible();

  // estimation synchronize each page
  await page.getByText("3", { exact: true }).click();
  await expect(page.getByTestId("estimations/test@example.com/card")).toHaveAttribute("data-state", "estimated");
  await expect(other.getByTestId("estimations/test@example.com/card")).toBeVisible();
});

test("result game", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  await page.getByPlaceholder("e.g. A sprint").type("CI sample");

  await submit.click();

  // move to select game page
  const link = page.getByRole("link", { name: "CI sample" });

  // open game
  await link.click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeVisible();

  // estimation
  await page.getByText("3", { exact: true }).click();

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

  await expect(page.getByTestId("estimations/test@example.com/card")).toHaveText("3");
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeEmpty();
  await expect(other.getByTestId("estimations/test@example.com/card")).toHaveText("3");
  await expect(other.getByTestId("estimations/test2@example.com/card")).toBeEmpty();

  await expect(page.getByTestId("resultCard")).toContainText("3");
  await expect(other.getByTestId("resultCard")).toContainText("3");

  await expect(page.getByTestId("average")).toContainText("Score3");
  await expect(other.getByTestId("average")).toContainText("Score3");

  // start next round.
  await nextRoundButton.click();
  await expect(nextRoundButton).toBeHidden();
  await expect(nextRoundButtonOnOtherPage).toBeHidden();

  await expect(page.getByTestId("estimations/test@example.com/card")).toBeEmpty();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeEmpty();
  await expect(other.getByTestId("estimations/test@example.com/card")).toBeEmpty();
  await expect(other.getByTestId("estimations/test2@example.com/card")).toBeEmpty();

  for (let card of [1, 2, 3, 5, 8, 13, 21, 34, 55, 89]) {
    await expect(page.getByText(`${card}`, { exact: true })).toBeVisible();
    await expect(other.getByText(`${card}`, { exact: true })).toBeVisible();
  }
});

test("leave from game", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  await page.getByPlaceholder("e.g. A sprint").type("CI sample");

  await submit.click();

  // open game
  await page.getByRole("link", { name: "CI sample" }).click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeVisible();
  await expect(page.getByTestId("game-info/leave")).toBeHidden();

  // leave from current game. This button is hidden first, and hidden by clip-path
  await other.getByTestId("game-info/leave").hover({ position: { x: 10, y: 10 } });
  await other.getByTestId("game-info/leave").click();

  // expect left user do not display in page
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).not.toBeVisible();

  // left user is navigated to select page, and do not display any game
  await expect(other).toHaveURL(/.*game\/?$/);
  await expect(other.getByText("You do not have games that you are invited before.")).toBeVisible();

  await other.goto("/game/");
  await expect(other.getByText("You do not have games that you are invited before.")).toBeVisible();
});

test("re-open and restore current round", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  await page.getByPlaceholder("e.g. A sprint").type("CI sample");

  await submit.click();

  // open game
  await page.getByRole("link", { name: "CI sample" }).click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeVisible();

  await page.getByText("3", { exact: true }).click();

  // re-open and restore information
  await other.goto("/game");
  await other.getByRole("link", { name: "CI sample" }).click();
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeVisible();

  await expect(page.getByTestId("estimations/test@example.com/card")).toHaveAttribute("data-state", "estimated");
});

test("kick player", async ({ page, newPageOnNewContext: other, resetFirebase }) => {
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

  await page.getByPlaceholder("e.g. A sprint").type("CI sample");
  await submit.click();

  // open game
  await page.getByRole("link", { name: "CI sample" }).click();

  // join game with other
  await page.getByTestId("invitation/opener").click();
  const joinUrl = await page.getByTestId("invitation/container").getByRole("textbox").inputValue();
  await other.goto(joinUrl);
  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).toBeVisible();
  await expect(page.getByTestId("joined-user-list/root")).toBeVisible();
  await expect(other.getByTestId("joined-user-list/root")).toBeVisible();

  // open joined user list
  await page.getByTestId("joined-user-list/opener").click();
  await expect(page.getByTestId("joined-user-list/list")).toContainText("test@example.com");
  await expect(page.getByTestId("joined-user-list/list")).toContainText("test2@example.com");

  await other.getByTestId("joined-user-list/opener").click();
  await expect(other.getByTestId("joined-user-list/list")).toContainText("test@example.com");
  await expect(other.getByTestId("joined-user-list/list")).toContainText("test2@example.com");

  // Kick user
  const kickButton = page.getByTestId("joined-user-list/test2@example.com/kick/root");

  await kickButton.hover({ position: { x: 10, y: 10 } });
  await kickButton.getByRole("button", { name: "Kick" }).click();
  await kickButton.getByRole("button", { name: "Yes" }).click();

  await expect(page.getByTestId("estimations/test@example.com/card")).toBeVisible();
  await expect(page.getByTestId("estimations/test2@example.com/card")).not.toBeVisible();
  await expect(page.getByTestId("joined-user-list/list")).toContainText("test@example.com");
  await expect(page.getByTestId("joined-user-list/list")).not.toContainText("test2@example.com");

  // kicked user is navigated to select page, and do not display any game
  await expect(other).toHaveURL(/.*game\/?$/);
  await expect(other.getByText("You do not have games that you are invited before.")).toBeVisible();
});
