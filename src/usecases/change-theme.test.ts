import { test, expect } from "vitest";
import * as sinon from "sinon";
import { ChangeThemeUseCase } from "./change-theme";
import * as Round from "@/domains/round";
import * as User from "@/domains/user";
import { createMockedRoundRepository, randomRound } from "@/test-lib";
import { estimated } from "@/domains/user-estimation";

test("should return error if user not found", async () => {
  // Arrange
  const input = {
    roundId: Round.createId(),
    theme: "foo",
  };
  const repository = createMockedRoundRepository();
  const useCase = new ChangeThemeUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("notFound");
});

test("should be able to change theme", async () => {
  // Arrange
  const id = Round.createId();
  const input = {
    roundId: id,
    theme: "name",
  };
  const save = sinon.fake();
  const repository = createMockedRoundRepository({
    save,
    findBy: sinon.fake.returns(Promise.resolve(randomRound({ id: id }))),
  });
  const useCase = new ChangeThemeUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("success");
  expect(save.callCount).toBe(1);
  expect(save.lastCall.firstArg.theme).toEqual("name");
});

test("can not change theme when round is finished", async () => {
  // Arrange
  const id = Round.createId();
  const input = {
    roundId: id,
    theme: "name",
  };
  const save = sinon.fake();
  let round = randomRound({ id: id });
  round = Round.takePlayerEstimation(round, User.createId(), estimated(round.cards[0]));
  const repository = createMockedRoundRepository({
    save,
    findBy: sinon.fake.returns(Promise.resolve(Round.showDown(round as Round.Round, new Date())[0])),
  });
  const useCase = new ChangeThemeUseCase(repository);

  // Act
  const ret = await useCase.execute(input);

  // Assert
  expect(ret.kind).toBe("canNotChangeTheme");
});
