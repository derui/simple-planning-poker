import { User } from "@spp/shared-domain";
import { clear } from "@spp/shared-domain/mock/user-repository";
import { UserRepository } from "@spp/shared-domain/user-repository";
import { beforeEach, expect, test } from "vitest";
import { Authenticator } from "./memory.js";

beforeEach(() => {
  clear();
});

test("should be able to sign up", async () => {
  // Arrange

  // Act
  const ret = await Authenticator.signUp({ name: "name", email: "test@example.com", password: "password" });

  // Assert
  expect(ret).toEqual(User.createId("test@example.com/password"));
});

test("create user when sign up succeeded", async () => {
  // Arrange

  // Act
  const ret = await Authenticator.signUp({ name: "name", email: "test@example.com", password: "password" });
  const user = await UserRepository.findBy({ id: ret! });

  // Assert
  expect(user!.name).toEqual("name");
});

test("can not sign in if user does not exist", async () => {
  // Arrange

  // Act
  const ret = await Authenticator.signIn({ email: "test@example.com", password: "password" });

  // Assert
  expect(ret).toBeUndefined();
});

test("can sign in after sign up", async () => {
  // Arrange
  const signInRet = await Authenticator.signUp({ name: "name", email: "test@example.com", password: "password" });

  // Act
  const ret = await Authenticator.signIn({ email: "test@example.com", password: "password" });

  // Assert
  expect(ret).toEqual(signInRet);
  expect(ret).not.toBeUndefined();
});
