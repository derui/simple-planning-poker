import { Page } from "@playwright/test";

/**
 * helper function to sign up
 */
export const signIn = async function signIn(page: Page, email: string, password: string) {
  await page.getByPlaceholder("e.g. yourname@yourdomain.com").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByText("Submit").click();
};
