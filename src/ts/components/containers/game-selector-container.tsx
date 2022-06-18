import { useJoinedGamesState } from "@/status/user/selectors";
import { Link } from "solid-app-router";
import { Component, For, Show } from "solid-js";

interface Props {}

const EmptyComponent = () => {
  return (
    <div class="app__game-selector__empty">
      <span class="app__game-selector__empty__text">You do not have games that you are invited before.</span>
    </div>
  );
};

export const GameSelectorContainer: Component<Props> = () => {
  const games = useJoinedGamesState();

  return (
    <div class="app__game-selector">
      <header class="app__game-selector__header">Select game you already joined</header>
      <main class="app__game-selector__main">
        <Show when={games.length > 0}>
          <For each={games}>
            {(v) => (
              <Link class="app__game-selector__main__selection-container" href={`/game/${v.id}`}>
                <span class="app__game-selector__main__game-selector">{v.name}</span>
              </Link>
            )}
          </For>
        </Show>
        <Show when={games.length === 0}>
          <EmptyComponent />
        </Show>
      </main>
      <footer class="app__game-selector__footer">
        <Link class="app__game-selector__creator-opener" href="/game/create">
          Create Game
        </Link>
      </footer>
    </div>
  );
};
