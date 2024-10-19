import { describe, expect, test } from "vitest";
import {
  createUseJoin,
  createUsePollingPlace,
  createUseRevealed,
  createUseVoting,
  createUseVotingStatus,
} from "./voting.js";
import { act, renderHook } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import { ApplicablePoints, Estimations, StoryPoint, User, UserEstimation, Voter, Voting } from "@spp/shared-domain";
import sinon from "sinon";
import { newMemoryVotingRepository } from "@spp/shared-domain/mock/voting-repository";
import { newMemoryUserRepository } from "@spp/shared-domain/mock/user-repository";
import { UseLoginUser } from "@spp/feature-login";
import { ChangeThemeUseCase, ChangeUserModeUseCase, EstimatePlayerUseCase, RevealUseCase } from "@spp/shared-use-case";
import { enableMapSet } from "immer";

enableMapSet();

/* eslint-disable  @typescript-eslint/require-await */
/* eslint-disable  @typescript-eslint/consistent-type-assertions */

const createWrapper =
  (store: ReturnType<typeof createStore>) =>
  ({ children }: { children: React.ReactNode }) => <Provider store={store}>{children}</Provider>;

describe("UseVotingStatus", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

  test("get voting status when voting is not revealed", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const votingRepository = newMemoryVotingRepository([
      Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      }),
    ]);
    const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
    const store = createStore();
    const wrapper = createWrapper(store);
    const useLoginUser: UseLoginUser = () => {
      return {
        userId,
      };
    };

    // Act
    const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
    const { result, rerender } = renderHook(() => createUseVotingStatus()(), { wrapper });

    await act(async () => {
      join.result.current.join(votingId);
    });
    rerender();

    // Assert
    expect(result.current.status).toEqual("voting");
  });

  test("get voting status when voting is revealed", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const votingRepository = newMemoryVotingRepository([
      Voting.revealedOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      }),
    ]);
    const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
    const store = createStore();
    const wrapper = createWrapper(store);
    const useLoginUser: UseLoginUser = () => {
      return {
        userId: userId,
      };
    };

    // Act
    const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
    const { result, rerender } = renderHook(() => createUseVotingStatus()(), { wrapper });

    await act(async () => {
      join.result.current.join(votingId);
    });
    rerender();

    // Assert
    expect(result.current.status).toEqual("revealed");
  });
});

describe("UsePollingPlace", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

  test("get voting after joined", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const votingRepository = newMemoryVotingRepository([
      Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      }),
    ]);
    const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
    const store = createStore();
    const wrapper = createWrapper(store);
    const useLoginUser: UseLoginUser = () => {
      return {
        userId,
      };
    };

    // Act
    const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
    const { result, rerender } = renderHook(() => createUsePollingPlace()(), { wrapper });

    await act(async () => {
      join.result.current.join(votingId);
    });
    rerender();

    // Assert
    expect(join.result.current.status).toEqual("joined");
    expect(result.current.loading).toBeFalsy();
    expect(result.current.theme).toEqual("foo");
    expect(result.current.estimations).toEqual([{ name: "foo", estimated: false }]);
  });
});

describe("UseVoting", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

  test("get voting after joined", async () => {
    // Arrange
    const userId = User.createId();
    const votingId = Voting.createId();
    const votingRepository = newMemoryVotingRepository([
      Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      }),
    ]);
    const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
    const store = createStore();
    const wrapper = createWrapper(store);
    const useLoginUser: UseLoginUser = () => {
      return {
        userId,
      };
    };

    // Act
    const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });

    await act(async () => {
      join.result.current.join(votingId);
    });

    // Assert
    expect(join.result.current.status).toEqual("joined");
  });

  describe("ChangeTheme", () => {
    test("can not call use case if voting is not ready", async () => {
      // Arrange
      const userId = User.createId();
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake();
      const { result } = renderHook(
        () =>
          createUseVoting({
            useLoginUser,
            changeThemeUseCase: fake,
            estimatePlayerUseCase: sinon.fake(),
            changeUserModeUseCase: sinon.fake(),
            revealUseCase: sinon.fake(),
          })(),
        { wrapper }
      );

      result.current.changeTheme("new");

      // Assert
      expect(fake.called).toBeFalsy();
    });

    test("call use case and get updated voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      const votingRepository = newMemoryVotingRepository([voting]);
      const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake.resolves<unknown[], ReturnType<ChangeThemeUseCase>>({
        kind: "success",
        voting: Voting.changeTheme(voting, "new theme"),
      });
      const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
      const pollingPlace = renderHook(() => createUsePollingPlace()(), { wrapper });
      const { result } = renderHook(
        () =>
          createUseVoting({
            useLoginUser,
            changeThemeUseCase: fake,
            estimatePlayerUseCase: sinon.fake(),
            changeUserModeUseCase: sinon.fake(),
            revealUseCase: sinon.fake(),
          })(),
        { wrapper }
      );

      await act(async () => {
        join.result.current.join(votingId);
      });

      await act(async () => {
        result.current.changeTheme("new theme");
      });

      // Assert
      expect(pollingPlace.result.current.theme).toEqual("new theme");
    });
  });

  describe("estimate", () => {
    test("call use-case and get updated voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      const votingRepository = newMemoryVotingRepository([voting]);
      const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake.resolves<unknown[], ReturnType<EstimatePlayerUseCase>>({
        kind: "success",
        voting: Voting.takePlayerEstimation(voting, userId, UserEstimation.submittedOf(StoryPoint.create(1))),
      });
      const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
      const { result } = renderHook(
        () =>
          createUseVoting({
            useLoginUser,
            changeThemeUseCase: sinon.fake(),
            estimatePlayerUseCase: fake,
            changeUserModeUseCase: sinon.fake(),
            revealUseCase: sinon.fake(),
          })(),
        { wrapper }
      );

      await act(async () => {
        join.result.current.join(votingId);
      });

      await act(async () => {
        result.current.estimate(5);
      });

      // Assert
      expect(fake.calledWith({ userId, votingId, userEstimation: UserEstimation.submittedOf(StoryPoint.create(1)) }));
    });
  });

  describe("reveal", () => {
    test("call use-case and get updated voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      const votingRepository = newMemoryVotingRepository([voting]);
      const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake.resolves<unknown[], ReturnType<RevealUseCase>>({
        kind: "success",
        voting,
      });
      const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
      const { result } = renderHook(
        () =>
          createUseVoting({
            useLoginUser,
            changeThemeUseCase: sinon.fake(),
            estimatePlayerUseCase: sinon.fake(),
            changeUserModeUseCase: sinon.fake(),
            revealUseCase: fake,
          })(),
        { wrapper }
      );

      await act(async () => {
        join.result.current.join(votingId);
      });

      await act(async () => {
        result.current.reveal();
      });

      // Assert
      expect(fake.calledWith({ votingId }));
    });
  });
});

describe("UseRevealed", () => {
  const POINTS = ApplicablePoints.create([StoryPoint.create(1)]);

  describe("ChangeTheme", () => {
    test("can not call use case if voting is not ready", async () => {
      // Arrange
      const store = createStore();
      const wrapper = createWrapper(store);

      // Act
      const fake = sinon.fake();
      const { result } = renderHook(
        () =>
          createUseRevealed({
            changeThemeUseCase: fake,
            resetVotingUseCase: sinon.fake(),
          })(),
        { wrapper }
      );

      result.current.changeTheme("new");

      // Assert
      expect(fake.called).toBeFalsy();
    });

    test("call use case and get updated voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      const votingRepository = newMemoryVotingRepository([voting]);
      const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake.resolves<unknown[], ReturnType<ChangeThemeUseCase>>({
        kind: "success",
        voting: Voting.changeTheme(voting, "new theme"),
      });
      const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
      const pollingPlace = renderHook(() => createUsePollingPlace()(), { wrapper });
      const { result } = renderHook(
        () =>
          createUseRevealed({
            changeThemeUseCase: fake,
            resetVotingUseCase: sinon.fake(),
          })(),
        { wrapper }
      );

      await act(async () => {
        join.result.current.join(votingId);
      });

      await act(async () => {
        result.current.changeTheme("new theme");
      });

      // Assert
      expect(pollingPlace.result.current.theme).toEqual("new theme");
    });
  });

  describe("reveal", () => {
    test("call use-case and get updated voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      const votingRepository = newMemoryVotingRepository([voting]);
      const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake.resolves<unknown[], ReturnType<RevealUseCase>>({
        kind: "success",
        voting,
      });
      const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
      const { result } = renderHook(
        () =>
          createUseVoting({
            useLoginUser,
            changeThemeUseCase: sinon.fake(),
            estimatePlayerUseCase: sinon.fake(),
            changeUserModeUseCase: sinon.fake(),
            revealUseCase: fake,
          })(),
        { wrapper }
      );

      await act(async () => {
        join.result.current.join(votingId);
      });

      await act(async () => {
        result.current.reveal();
      });

      // Assert
      expect(fake.calledWith({ votingId }));
    });
  });

  describe("change voter type", () => {
    test("call use-case and get updated voting", async () => {
      // Arrange
      const userId = User.createId();
      const votingId = Voting.createId();
      const voting = Voting.votingOf({
        id: votingId,
        points: POINTS,
        theme: "foo",
        estimations: Estimations.empty(),
        voters: [Voter.createVoter({ user: userId })],
      });
      const votingRepository = newMemoryVotingRepository([voting]);
      const userRepository = newMemoryUserRepository([User.create({ id: userId, name: "foo" })]);
      const store = createStore();
      const wrapper = createWrapper(store);
      const useLoginUser: UseLoginUser = () => {
        return {
          userId,
        };
      };

      // Act
      const fake = sinon.fake.resolves<unknown[], ReturnType<ChangeUserModeUseCase>>({
        kind: "success",
        voting,
      });
      const join = renderHook(() => createUseJoin(useLoginUser, votingRepository, userRepository)(), { wrapper });
      const pollingPlace = renderHook(() => createUsePollingPlace()(), { wrapper });
      const { result } = renderHook(
        () =>
          createUseVoting({
            useLoginUser,
            changeThemeUseCase: sinon.fake(),
            estimatePlayerUseCase: sinon.fake(),
            changeUserModeUseCase: fake,
            revealUseCase: sinon.fake(),
          })(),
        { wrapper }
      );

      await act(async () => {
        join.result.current.join(votingId);
      });

      await act(async () => {
        result.current.changeVoterRole("inspector");
      });

      // Assert
      expect(fake.calledWith({ userId, votingId, voterType: Voter.VoterType.Inspector }));
      expect(pollingPlace.result.current.userRole).toEqual("inspector");
    });
  });
});
