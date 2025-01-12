import { renderHook } from "@testing-library/react-hooks";
import { currentUserIdAtom, currentVotingIdAtom } from "./voting-atom.js";
import { useVoter } from "./use-voter.js";

describe("useVoter", () => {
  it("should return undefined role and false isInspector if no user or voting is set", () => {
    const { result } = renderHook(() => useVoter());

    expect(result.current.role).toBeUndefined();
    expect(result.current.isInspector).toBe(false);
  });

  it("should return the correct role and isInspector based on current voter's role", async () => {
    const votingId = "voting123";
    const userId = "user456";

    const { result, waitFor } = renderHook(() => useVoter(), {
      initialProps: {
        atoms: [
          [currentVotingIdAtom, votingId],
          [currentUserIdAtom, userId],
        ],
      },
    });

    await waitFor(() => {
      expect(result.current.role).toBe(VoterType.Normal);
      expect(result.current.isInspector).toBe(false);
    });
  });

  it("should return true isInspector if the current user's role is Inspector", async () => {
    const votingId = "voting123";
    const userId = "user456";

    const { result, waitFor } = renderHook(() => useVoter(), {
      initialProps: {
        atoms: [
          [currentVotingIdAtom, votingId],
          [currentUserIdAtom, userId],
        ],
      },
    });

    await waitFor(() => {
      expect(result.current.role).toBe(VoterType.Inspector);
      expect(result.current.isInspector).toBe(true);
    });
  });
});
