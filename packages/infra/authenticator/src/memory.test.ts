import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { expect, test } from "vitest";
import { newMemoryAuthenticator } from "./memory.js";
import { User } from "@spp/shared-domain";

test("should be able to sign up", async () => {
  // Arrange
  const repository = newMemoryUserRepository();
  const authenticator = newMemoryAuthenticator(repository);

  // Act
  const ret = await authenticator.signUp("name", "test@example.com", "password");

  // Assert
  expect(ret).toEqual(User.createId("test@example.com/password"));
});

test("create user when sign up succeeded", async () => {
  // Arrange
  const repository = newMemoryUserRepository();
  const authenticator = newMemoryAuthenticator(repository);

  // Act
  const ret = await authenticator.signUp("name", "test@example.com", "password");
  const user = await repository.findBy(ret!);

  // Assert
  expect(user!.name).toEqual("name");
});

test("can not sign in if user does not exist", async () => {
  // Arrange
  const repository = newMemoryUserRepository();
  const authenticator = newMemoryAuthenticator(repository);

  // Act
  const ret = await authenticator.signIn("test@example.com", "password");

  // Assert
  expect(ret).toBeUndefined();
});

test("can sign in after sign up", async () => {
  // Arrange
  const repository = newMemoryUserRepository();
  const authenticator = newMemoryAuthenticator(repository);

  const signInRet = await authenticator.signUp("name", "test@example.com", "password");

  // Act
  const ret = await authenticator.signIn("test@example.com", "password");

  // Assert
  expect(ret).toEqual(signInRet);
  expect(ret).not.toBeUndefined();
});
