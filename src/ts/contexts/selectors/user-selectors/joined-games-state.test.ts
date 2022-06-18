import { joinedGamesState } from "./joined-games-state";
import { setCurrentUserState } from "@/status/user/signals/current-user-state";
import { createRoot } from "solid-js";

test("return empty list if default state", () =>
  createRoot((dispose) => {
    const value = joinedGamesState();

    expect(value()).toHaveLength(0);
    dispose();
  }));

test("return joined games if user joined", () =>
  createRoot((dispose) => {
    setCurrentUserState((prev) => {
      return { ...prev, joinedGames: [{} as any] };
    });

    const value = joinedGamesState();

    expect(value()).toHaveLength(1);

    dispose();
  }));
