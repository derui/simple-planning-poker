import { Page } from "@playwright/test";

/**
 * helper function to sign up
 */
export const signIn = async function signIn(page: Page, email: string, password: string) {
  await page.getByTestId("email").type(email);
  await page.getByTestId("password").type(password);
  await page.getByRole("button").click();
};
