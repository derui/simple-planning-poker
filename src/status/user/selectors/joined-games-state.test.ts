import { snapshot_UNSTABLE } from "recoil";
import joinedGamesState from "./joined-games-state";
import currentUserState from "../atoms/current-user-state";

test("return empty list if default state", () => {
  const snapshot = snapshot_UNSTABLE();
  const value = snapshot.getLoadable(joinedGamesState).valueOrThrow();

  expect(value).toHaveLength(0);
});

test("return joined games if user joined", () => {
  const snapshot = snapshot_UNSTABLE(({ set }) => {
    set(currentUserState, (prev) => {
      return { ...prev, joinedGames: [{} as any] };
    });
  });
  const value = snapshot.getLoadable(joinedGamesState).valueOrThrow();

  expect(value).toHaveLength(1);
});
